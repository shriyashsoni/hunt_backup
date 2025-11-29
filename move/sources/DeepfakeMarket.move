module deepfake_hunters::market {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use std::vector;

    // Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_MARKET_NOT_FOUND: u64 = 2;
    const E_MARKET_ALREADY_RESOLVED: u64 = 3;
    const E_MARKET_EXPIRED: u64 = 4;
    const E_INSUFFICIENT_BALANCE: u64 = 5;
    const E_NO_WINNINGS: u64 = 6;

    struct AdminCap has key {}

    struct Market has store {
        id: u64,
        creator: address,
        content_url: vector<u8>,
        real_pool: u64,
        ai_pool: u64,
        is_resolved: bool,
        is_real: bool,
        end_time: u64,
        total_bets: u64,
    }

    struct Bet has store {
        market_id: u64,
        amount: u64,
        bet_on_real: bool,
        claimed: bool,
    }

    struct MarketStore has key {
        markets: vector<Market>,
        market_count: u64,
        treasury: coin::Coin<AptosCoin>,
    }

    struct UserBets has key {
        bets: vector<Bet>,
    }

    fun init_module(sender: &signer) {
        move_to(sender, AdminCap {});
        move_to(sender, MarketStore {
            markets: vector::empty(),
            market_count: 0,
            treasury: coin::zero<AptosCoin>(),
        });
    }

    public entry fun create_market(
        sender: &signer,
        content_url: vector<u8>,
        duration_seconds: u64
    ) acquires MarketStore {
        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        let market_id = store.market_count;
        
        let market = Market {
            id: market_id,
            creator: signer::address_of(sender),
            content_url,
            real_pool: 0,
            ai_pool: 0,
            is_resolved: false,
            is_real: false,
            end_time: timestamp::now_seconds() + duration_seconds,
            total_bets: 0,
        };

        vector::push_back(&mut store.markets, market);
        store.market_count = store.market_count + 1;
    }

    public entry fun place_bet(
        sender: &signer,
        market_id: u64,
        amount: u64,
        bet_on_real: bool
    ) acquires MarketStore, UserBets {
        let sender_addr = signer::address_of(sender);
        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        
        assert!(market_id < vector::length(&store.markets), E_MARKET_NOT_FOUND);
        let market = vector::borrow_mut(&mut store.markets, market_id);
        
        assert!(!market.is_resolved, E_MARKET_ALREADY_RESOLVED);
        assert!(timestamp::now_seconds() < market.end_time, E_MARKET_EXPIRED);

        // Transfer coins to treasury
        let coins = coin::withdraw<AptosCoin>(sender, amount);
        coin::merge(&mut store.treasury, coins);

        // Update pools
        if (bet_on_real) {
            market.real_pool = market.real_pool + amount;
        } else {
            market.ai_pool = market.ai_pool + amount;
        };
        market.total_bets = market.total_bets + 1;

        // Record bet
        if (!exists<UserBets>(sender_addr)) {
            move_to(sender, UserBets { bets: vector::empty() });
        };
        
        let user_bets = borrow_global_mut<UserBets>(sender_addr);
        vector::push_back(&mut user_bets.bets, Bet {
            market_id,
            amount,
            bet_on_real,
            claimed: false,
        });
    }

    public entry fun resolve_market(
        sender: &signer, 
        market_id: u64, 
        is_real: bool
    ) acquires MarketStore {
        // Check admin permissions using exists (does not require acquires)
        assert!(exists<AdminCap>(signer::address_of(sender)), E_NOT_AUTHORIZED);

        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        assert!(market_id < vector::length(&store.markets), E_MARKET_NOT_FOUND);
        
        let market = vector::borrow_mut(&mut store.markets, market_id);
        assert!(!market.is_resolved, E_MARKET_ALREADY_RESOLVED);

        market.is_resolved = true;
        market.is_real = is_real;
    }

    public entry fun claim_rewards(
        sender: &signer,
        market_id: u64
    ) acquires MarketStore, UserBets {
        let sender_addr = signer::address_of(sender);
        assert!(exists<UserBets>(sender_addr), E_NO_WINNINGS);

        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        let market = vector::borrow(&store.markets, market_id);
        assert!(market.is_resolved, E_MARKET_NOT_FOUND);

        let user_bets = borrow_global_mut<UserBets>(sender_addr);
        let i = 0;
        let total_reward = 0;

        while (i < vector::length(&user_bets.bets)) {
            let bet = vector::borrow_mut(&mut user_bets.bets, i);
            if (bet.market_id == market_id && !bet.claimed && bet.bet_on_real == market.is_real) {
                // Calculate reward
                let winning_pool = if (market.is_real) market.real_pool else market.ai_pool;
                let losing_pool = if (market.is_real) market.ai_pool else market.real_pool;
                
                // Return original bet + share of losing pool
                // Share = (bet_amount / winning_pool) * losing_pool
                // Total = bet_amount + Share
                
                if (winning_pool > 0) {
                    let share = (bet.amount as u128) * (losing_pool as u128) / (winning_pool as u128);
                    total_reward = total_reward + bet.amount + (share as u64);
                } else {
                    total_reward = total_reward + bet.amount;
                };
                
                bet.claimed = true;
            };
            i = i + 1;
        };

        assert!(total_reward > 0, E_NO_WINNINGS);

        // Transfer rewards
        let reward_coins = coin::extract(&mut store.treasury, total_reward);
        coin::deposit(sender_addr, reward_coins);
    }
}

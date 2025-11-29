module admin::bounty {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::event;
    use aptos_framework::account;

    struct Bounty has key, store {
        id: u64,
        content_hash: vector<u8>,
        creator: address,
        deadline: u64,
        is_resolved: bool,
        is_real: bool,
        real_pool: u64,
        ai_pool: u64,
    }

    struct BountyStore has key {
        bounties: vector<Bounty>,
        bounty_count: u64,
    }

    struct Bet has store {
        bounty_id: u64,
        bettor: address,
        is_real: bool,
        amount: u64,
    }

    struct BetStore has key {
        bets: vector<Bet>,
    }

    struct BountyCreatedEvent has drop, store {
        bounty_id: u64,
        creator: address,
        content_hash: vector<u8>,
    }

    struct BetPlacedEvent has drop, store {
        bounty_id: u64,
        bettor: address,
        is_real: bool,
        amount: u64,
    }

    struct BountyResolvedEvent has drop, store {
        bounty_id: u64,
        is_real: bool,
    }

    const E_BOUNTY_NOT_FOUND: u64 = 1;
    const E_BOUNTY_ALREADY_RESOLVED: u64 = 2;
    const E_DEADLINE_PASSED: u64 = 3;
    const E_NOT_AUTHORIZED: u64 = 4;

    public entry fun init_module(account: &signer) {
        move_to(account, BountyStore {
            bounties: vector::empty(),
            bounty_count: 0,
        });
        move_to(account, BetStore {
            bets: vector::empty(),
        });
    }

    public entry fun create_bounty(creator: &signer, content_hash: vector<u8>) acquires BountyStore {
        let creator_addr = signer::address_of(creator);
        let store = borrow_global_mut<BountyStore>(@admin);
        
        let bounty_id = store.bounty_count + 1;
        let deadline = timestamp::now_seconds() + 86400; // 24 hours

        let new_bounty = Bounty {
            id: bounty_id,
            content_hash,
            creator: creator_addr,
            deadline,
            is_resolved: false,
            is_real: false, // Default
            real_pool: 0,
            ai_pool: 0,
        };

        vector::push_back(&mut store.bounties, new_bounty);
        store.bounty_count = bounty_id;

        event::emit(BountyCreatedEvent {
            bounty_id,
            creator: creator_addr,
            content_hash,
        });
    }

    public entry fun place_bet(bettor: &signer, bounty_id: u64, is_real: bool, amount: u64) acquires BountyStore, BetStore {
        let bettor_addr = signer::address_of(bettor);
        let store = borrow_global_mut<BountyStore>(@admin);
        
        // Find bounty (simplified for demo, would use table in prod)
        let bounty_len = vector::length(&store.bounties);
        let i = 0;
        let found = false;
        while (i < bounty_len) {
            let bounty = vector::borrow_mut(&mut store.bounties, i);
            if (bounty.id == bounty_id) {
                assert!(!bounty.is_resolved, E_BOUNTY_ALREADY_RESOLVED);
                assert!(timestamp::now_seconds() < bounty.deadline, E_DEADLINE_PASSED);

                // Transfer funds (mocked for simplicity in this snippet, would use coin::transfer)
                coin::transfer<AptosCoin>(bettor, @admin, amount);

                if (is_real) {
                    bounty.real_pool = bounty.real_pool + amount;
                } else {
                    bounty.ai_pool = bounty.ai_pool + amount;
                };
                found = true;
                break
            };
            i = i + 1;
        };
        assert!(found, E_BOUNTY_NOT_FOUND);

        let bet_store = borrow_global_mut<BetStore>(@admin);
        vector::push_back(&mut bet_store.bets, Bet {
            bounty_id,
            bettor: bettor_addr,
            is_real,
            amount,
        });

        event::emit(BetPlacedEvent {
            bounty_id,
            bettor: bettor_addr,
            is_real,
            amount,
        });
    }

    public entry fun resolve_bounty(admin: &signer, bounty_id: u64, is_real: bool) acquires BountyStore {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @admin, E_NOT_AUTHORIZED);

        let store = borrow_global_mut<BountyStore>(@admin);
        let bounty_len = vector::length(&store.bounties);
        let i = 0;
        while (i < bounty_len) {
            let bounty = vector::borrow_mut(&mut store.bounties, i);
            if (bounty.id == bounty_id) {
                bounty.is_resolved = true;
                bounty.is_real = is_real;
                break
            };
            i = i + 1;
        };

        event::emit(BountyResolvedEvent {
            bounty_id,
            is_real,
        });
        
        // Payout logic would go here (iterating bets and distributing funds)
    }
}

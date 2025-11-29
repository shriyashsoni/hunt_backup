module admin::mock_shelby_oracle {
    use std::signer;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    struct VerificationRequestedEvent has drop, store {
        content_hash: vector<u8>,
        timestamp: u64,
    }

    struct VerificationResultEvent has drop, store {
        bounty_id: u64,
        is_real: bool,
        timestamp: u64,
    }

    public entry fun request_verification(content_hash: vector<u8>) {
        event::emit(VerificationRequestedEvent {
            content_hash,
            timestamp: timestamp::now_seconds(),
        });
    }

    public entry fun submit_verification(admin: &signer, bounty_id: u64) {
        // Admin only check would be here
        
        let ts = timestamp::now_seconds();
        let is_real = if (ts % 3 == 0) { true } else { false };

        event::emit(VerificationResultEvent {
            bounty_id,
            is_real,
            timestamp: ts,
        });
    }
}

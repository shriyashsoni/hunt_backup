module admin::mock_reward {
    use std::string::String;
    use aptos_framework::event;

    struct RewardEvent has drop, store {
        user: address,
        event_type: String,
        points: u64,
    }

    public entry fun emit_reward_event(user: address, event_type: String, points: u64) {
        event::emit(RewardEvent {
            user,
            event_type,
            points,
        });
    }
}

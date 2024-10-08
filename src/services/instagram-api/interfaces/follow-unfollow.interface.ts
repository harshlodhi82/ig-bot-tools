export interface FriendshipStatusResponse {
    friendship_status: FriendshipStatus
    previous_following: boolean
    status: string
}

interface FriendshipStatus {
    following: boolean
    followed_by: boolean
    blocking: boolean
    muting: boolean
    is_private: boolean
    incoming_request: boolean
    outgoing_request: boolean
    is_bestie: boolean
    is_restricted: boolean
    is_feed_favorite: boolean
    subscribed: boolean
    is_eligible_to_subscribe: boolean
}

export interface FollowingList {
    users: FollowingUser[]
    big_list: boolean
    page_size: number
    next_max_id: string
    has_more: boolean
    should_limit_list_of_followers: boolean
    use_clickable_see_more: boolean
    show_spam_follow_request_tab: boolean
    status: string
}

interface FollowingUser {
    fbid_v2: string
    pk: string
    pk_id: string
    strong_id__: string
    full_name: string
    is_private: boolean
    third_party_downloads_enabled: number
    has_anonymous_profile_picture: boolean
    username: string
    is_verified: boolean
    profile_pic_id?: string
    profile_pic_url: string
    account_badges: any[]
    latest_reel_media: number
    is_favorite: boolean
}

export interface FollowerList {
    users: FollowerUser[]
    big_list: boolean
    page_size: number
    next_max_id: string
    groups: object[]
    more_groups_available: boolean
    has_more: boolean
    should_limit_list_of_followers: boolean
    use_clickable_see_more: boolean
    show_spam_follow_request_tab: boolean
    status: string
  }
  
  interface FollowerUser {
    fbid_v2: string
    pk: string
    pk_id: string
    strong_id__: string
    full_name: string
    is_private: boolean
    third_party_downloads_enabled: number
    has_anonymous_profile_picture: boolean
    username: string
    is_verified: boolean
    profile_pic_id?: string
    profile_pic_url: string
    account_badges: any[]
    latest_reel_media: number
  }
  
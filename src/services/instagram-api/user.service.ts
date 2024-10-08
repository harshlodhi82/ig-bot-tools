import { envConfigs } from "../../configs/env";
import { Utils } from "../../shared/libs";
import { ChromeService } from "../chrome";
import { InstagramRequestService } from "../instagram-request/instagram-request.service";
import { FriendshipStatusResponse } from "./interfaces/follow-unfollow.interface";
import { FollowerList, FollowingList } from "./interfaces/friendship-list.interface";
import { IPosCommentResponse, IUserInfo } from "./interfaces/user-info.interface";


export class UserService {

    private static userInfoDB: Map<'userInfo', IUserInfo> = new Map();
    private static MAX_FREINDSHIP_LIST_COUNT: number = 200;

    static getUserInfoFromCache(): IUserInfo {
        const userInfo = this.userInfoDB.get('userInfo');
        if (!userInfo) throw new Error("FATAL_ERROR: User Info is not available in cache, please call getUserInfo 1st.");
        return userInfo;
    }

    static async getUserInfo(): Promise<IUserInfo> {
        try {
            const username: string = await ChromeService.getCurrentLoggedInUsername();
            const api = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
            const response = await InstagramRequestService.get(api);
            const data: IUserInfo = await response.json();
            this.userInfoDB.set('userInfo', data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async postComment(postId: string, comment: string): Promise<boolean> {

        // prepare API
        const api = `https://www.instagram.com/api/v1/web/comments/${postId}/add/`;

        // prepare body
        const postCommentBody = {
            comment_text: comment
        }

        // create search params
        const searchParams = Utils.objectToSearchParams(postCommentBody);

        //call the API
        const response = await InstagramRequestService.post(api, searchParams, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        const data: IPosCommentResponse = await response.json();

        // verify response
        if (data.status !== "ok") return false;
        return true;
    }

    static async followUser(userId: string): Promise<boolean> {

        // prepare API
        const api = `https://www.instagram.com/api/v1/friendships/create/${userId}/`;

        // prepare body
        const postCommentBody = {
            container_module: 'single_post',
            user_id: userId,
        }

        // create search params
        const searchParams = Utils.objectToSearchParams(postCommentBody);

        //call the API
        const response = await InstagramRequestService.post(api, searchParams, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        const data: FriendshipStatusResponse = await response.json();
        return data.status === "ok";
    }

    static async unfollowUser(userId: string): Promise<boolean> {

        // prepare API
        const api = `https://www.instagram.com/api/v1/friendships/destroy/${userId}/`;

        // prepare body
        const postCommentBody = {
            container_module: 'profile',
            user_id: userId,
        }

        // create search params
        const searchParams = Utils.objectToSearchParams(postCommentBody);

        //call the API
        const response = await InstagramRequestService.post(api, searchParams, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        const data: FriendshipStatusResponse = await response.json();
        return data.status === "ok";
    }

    static async getFollowingList(userId: string, query: string, count: number, nextMaxId?: string): Promise<FollowingList> {
        // verify count
        if(count > this.MAX_FREINDSHIP_LIST_COUNT) {
            throw new Error(`Invalid count ${count}, Max count ${this.MAX_FREINDSHIP_LIST_COUNT} is supported`);
        }

        // prepare API
        let api = `https://www.instagram.com/api/v1/friendships/${userId}/following/?count=${count}&query=${query}`;
        if(nextMaxId) api = `${api}&max_id=${encodeURIComponent(nextMaxId)}`;

        //call the API
        const response = await InstagramRequestService.get(api, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        const data: FollowingList = await response.json();
        return data;
    } 

    static async getFollowersList(userId: string, query: string, count: number, nextMaxId?: string): Promise<FollowerList> {
        // verify count
        if(count > this.MAX_FREINDSHIP_LIST_COUNT) {
            throw new Error(`Invalid count ${count}, Max count ${this.MAX_FREINDSHIP_LIST_COUNT} is supported`);
        }

        // prepare API
        let api = `https://www.instagram.com/api/v1/friendships/${userId}/followers/?count=${count}&query=${query}`;
        if(nextMaxId) api = `${api}&max_id=${encodeURIComponent(nextMaxId)}`;

        //call the API
        const response = await InstagramRequestService.get(api, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        const data: FollowerList = await response.json();
        return data;
    } 

    static async getUserPosts(userId: string, query: string, count: number, nextMaxId?: string): Promise<FollowerList> {
        // verify count
        if(count > this.MAX_FREINDSHIP_LIST_COUNT) {
            throw new Error(`Invalid count ${count}, Max count ${this.MAX_FREINDSHIP_LIST_COUNT} is supported`);
        }

        // prepare API
        let api = `https://www.instagram.com/api/v1/friendships/${userId}/followers/?count=${count}&query=${query}`;
        if(nextMaxId) api = `${api}&max_id=${encodeURIComponent(nextMaxId)}`;

        //call the API
        const response = await InstagramRequestService.get(api, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        const data: FollowerList = await response.json();
        return data;
    } 
}

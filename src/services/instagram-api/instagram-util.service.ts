import { Utils } from "../../shared/libs";
import { FollowerList, FollowingList } from "./interfaces/friendship-list.interface";
import { UserService } from "./user.service";


export class InstagramUtilService {

    private static MAX_LIST_SIZE: number = 200;

    static async getAllFollowingUserIds(myId: string, allFollowingIds: string[] = [], nextMaxId?: string): Promise<string[]>{
        const followingList: FollowingList = await UserService.getFollowingList(myId, '', this.MAX_LIST_SIZE, nextMaxId);
        allFollowingIds.push(...followingList.users.map(elem => elem.pk));
        if(followingList.next_max_id){
            await Utils.randomWait(5000);
            const recursiveList: string[] = await this.getAllFollowingUserIds(myId, allFollowingIds, followingList.next_max_id);
            return recursiveList;
        }
        return allFollowingIds;
    }

    static async getAllFollowerUserIds(myId: string, allFollowerIds: string[] = [], nextMaxId?: string): Promise<string[]>{
        const followerList: FollowerList = await UserService.getFollowersList(myId, '', this.MAX_LIST_SIZE, nextMaxId);
        allFollowerIds.push(...followerList.users.map(elem => elem.pk));
        if(followerList.next_max_id){
            await Utils.randomWait(5000);
            const recursiveList: string[] = await this.getAllFollowerUserIds(myId, allFollowerIds, followerList.next_max_id);
            return recursiveList;
        }
        return allFollowerIds;
    }

    static async isUserFolowingUserName(userId: string, userName: string): Promise<boolean>{
        const followingList: FollowingList = await UserService.getFollowingList(userId, userName, 5);
        const isFollowing: boolean = followingList.users.some(elem => elem.username === userName);
        return isFollowing;
    }

    static async userIdsWithNoFollowBack(userId: string): Promise<string[]>{
        
        // takes users
        const followingIds = await this.getAllFollowingUserIds(userId);
        await Utils.randomWait(10000);
        const followerIds = await this.getAllFollowerUserIds(userId);

        // find user who doesn't follow back
        const userIdsWithNoFollowBack: string[] = Utils.differances(followingIds, followerIds);
        return userIdsWithNoFollowBack;
    }

    static async unfollowBulkUsers(userIds: string[]): Promise<void>{
        for (const userId of userIds) {
            await UserService.unfollowUser(userId)
            console.log(`unfollowed "${userId}"`);
            await Utils.randomWait(10000);
        }
    }

    static async unfollowNoFollowbackUsers(userId: string): Promise<void>{
        const userIdsWithNoFollowBack: string[] = await this.userIdsWithNoFollowBack(userId);
        await Utils.randomWait(10000);
        await this.unfollowBulkUsers(userIdsWithNoFollowBack);
    }
}

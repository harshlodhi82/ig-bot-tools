import { envConfigs } from "../../configs/env";
import { InstagramUtilService, UserService } from "../../services/instagram-api";
import { IUserInfo } from "../../services/instagram-api/interfaces/user-info.interface";


export class ScriptsController {

    static async init() {

        //0 - verify user
        const userInfo: IUserInfo = await UserService.getUserInfo();
        if (envConfigs.USER_NAME !== userInfo.data.user.username) {
            throw new Error(`Miss matching username "${envConfigs.USER_NAME}" and "${userInfo.data.user.username}"`);
        }

        console.log(`=> userInfo:`, userInfo);

        //1 - run scripts
        // await this.scripts(userInfo);
    }

    private static async scripts(userInfo: IUserInfo) {
        try {

            // await InstagramUtilService.unfollowNoFollowbackUsers(userInfo.data.user.id);
        
        } catch (error) {
            console.log(error);
        }
    }
}

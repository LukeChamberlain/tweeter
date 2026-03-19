import { FollowRequest, FollowResponse, AuthToken, User } from "tweeter-shared";
import { UserInfoService } from "../../model/service/UserInfoService";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
    const userInfoService = new UserInfoService();
    const [followerCount, followeeCount] = await userInfoService.followUser(
        new AuthToken(request.token, Date.now()),
        User.fromDto(request.user)!
    );

    return { success: true, message: null, followerCount, followeeCount }
}
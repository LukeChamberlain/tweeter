import { IsFollowerRequest, IsFollowerResponse, AuthToken, User } from "tweeter-shared";
import { UserInfoService } from "../../model/service/UserInfoService";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const userInfoService = new UserInfoService();
    const isFollower = await userInfoService.getIsFollowerStatus(
        new AuthToken(request.token, Date.now()),
        User.fromDto(request.currentUser)!,
        User.fromDto(request.displayedUser)!
    );

    return { success: true, message: null, isFollower }
}
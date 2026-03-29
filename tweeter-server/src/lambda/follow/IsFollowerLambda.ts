import { IsFollowerRequest, IsFollowerResponse, AuthToken, User } from "tweeter-shared";
import { UserInfoService } from "../../model/service/UserInfoService";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    await new AuthService().validateToken(request.token);
    
    const userInfoService = new UserInfoService();
    const isFollower = await userInfoService.getIsFollowerStatus(
        new AuthToken(request.token, Date.now()),
        User.fromDto(request.currentUser)!,
        User.fromDto(request.displayedUser)!
    );

    return { success: true, message: null, isFollower }
}
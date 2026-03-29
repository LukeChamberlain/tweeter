import { GetCountRequest, GetCountResponse, AuthToken, User } from "tweeter-shared";
import { UserInfoService } from "../../model/service/UserInfoService";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
    await new AuthService().validateToken(request.token);
    
    const userInfoService = new UserInfoService();
    const count = await userInfoService.getFollowerCount(
        new AuthToken(request.token, Date.now()),
        User.fromDto(request.user)!
    );

    return { success: true, message: null, count }
}
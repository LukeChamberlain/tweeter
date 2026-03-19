import { GetCountRequest, GetCountResponse, AuthToken, User } from "tweeter-shared";
import { UserInfoService } from "../../model/service/UserInfoService";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
    const userInfoService = new UserInfoService();
    const count = await userInfoService.getFollowerCount(
        new AuthToken(request.token, Date.now()),
        User.fromDto(request.user)!
    );

    return { success: true, message: null, count }
}
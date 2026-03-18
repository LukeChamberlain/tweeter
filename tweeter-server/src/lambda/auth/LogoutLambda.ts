import { TweeterRequest, TweeterResponse, AuthToken } from "tweeter-shared";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
    const authService = new AuthService();
    await authService.logout(new AuthToken(request.token, Date.now()));

    return {
        success: true,
        message: null
    }
}
import { PostStatusRequest, TweeterResponse, Status, User, AuthToken } from "tweeter-shared";
import { PostStatusService } from "../../model/service/PostStatusService";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    await new AuthService().validateToken(request.token);
    
    const statusService = new PostStatusService();
    const status = new Status(
        request.status.post,
        User.fromDto(request.status.user)!,
        request.status.timestamp
    );
    await statusService.postStatus(new AuthToken(request.token, Date.now()), status);

    return {
        success: true,
        message: null
    }
}
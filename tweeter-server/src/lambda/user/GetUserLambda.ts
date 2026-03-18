import { GetUserRequest, GetUserResponse, AuthToken } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const statusService = new StatusService();
    const user = await statusService.getUser(new AuthToken(request.token, Date.now()), request.alias);

    return {
        success: true,
        message: null,
        user: user ? user.Dto : null
    }
}
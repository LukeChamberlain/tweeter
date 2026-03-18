import { RegisterRequest, LoginResponse } from "tweeter-shared";
import { RegisterService } from "../../model/service/RegisterService";

export const handler = async (request: RegisterRequest): Promise<LoginResponse> => {
    const registerService = new RegisterService();
    const [user, authToken] = await registerService.register(
        request.firstName,
        request.lastName,
        request.alias,
        request.password,
        Buffer.from(request.userImageBytes, "base64"),
        request.imageFileExtension
    );

    return {
        success: true,
        message: null,
        user: user.Dto,
        authToken: authToken.token
    }
}
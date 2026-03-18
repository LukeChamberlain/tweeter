import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";

export class PostStatusService {
    private serverFacade = new ServerFacade();

    public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
        await this.serverFacade.postStatus({
            token: authToken.token,
            status: newStatus.dto
        });
    }
}
import { AuthToken } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";
export class AppNavbarService {
    private serverFacade = new ServerFacade();

    public async logout(authToken: AuthToken): Promise<void> {
        await this.serverFacade.logout({
            token: authToken.token
        });
    }
}
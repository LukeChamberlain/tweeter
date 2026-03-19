import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";

export class UserService {
    private serverFacade = new ServerFacade();

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.serverFacade.getUser({
            token: authToken.token,
            alias
        });
    }
}
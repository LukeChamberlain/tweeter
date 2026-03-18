import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";

export class LoginService {
    private serverFacade = new ServerFacade();

    public async login(alias: string, password: string): Promise<[User, AuthToken]> {
        return this.serverFacade.login({
            token: "",
            alias: alias,
            password: password
        });
    }
}
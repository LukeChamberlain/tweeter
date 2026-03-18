import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";
export class StatusService {
    private serverFacade = new ServerFacade();

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.serverFacade.getMoreStoryItems({
            token: authToken.token,
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null
        });
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.serverFacade.getMoreFeedItems({
            token: authToken.token,
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null
        });
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.serverFacade.getUser({
            token: authToken.token,
            alias
        });
    }
}
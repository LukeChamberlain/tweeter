import { AuthToken, Status, User } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const statusDao = this.factory.getStatusDao();
        return await statusDao.getStory(userAlias, pageSize, lastItem);
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const statusDao = this.factory.getStatusDao();
        return await statusDao.getFeed(userAlias, pageSize, lastItem);
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        const userDao = this.factory.getUserDao();
        return await userDao.getUser(alias);
    }
}
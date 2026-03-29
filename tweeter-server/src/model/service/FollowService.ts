import { UserDto, User } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        const followDao = this.factory.getFollowDao();
        const userDao = this.factory.getUserDao();

        const [aliases, hasMore] = await followDao.getFollowees(
            userAlias,
            pageSize,
            lastItem ? lastItem.alias : null
        );

        const users = await Promise.all(aliases.map(alias => userDao.getUser(alias)));
        const dtos = users
            .filter(user => user !== null)
            .map(user => user!.Dto);

        return [dtos, hasMore];
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        const followDao = this.factory.getFollowDao();
        const userDao = this.factory.getUserDao();

        const [aliases, hasMore] = await followDao.getFollowers(
            userAlias,
            pageSize,
            lastItem ? lastItem.alias : null
        );

        const users = await Promise.all(aliases.map(alias => userDao.getUser(alias)));
        const dtos = users
            .filter(user => user !== null)
            .map(user => user!.Dto);

        return [dtos, hasMore];
    }
}
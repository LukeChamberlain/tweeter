import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";

export class UserInfoService extends Service {
    public async getIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ): Promise<boolean> {
        if (currentUser.equals(displayedUser)) {
            return false;
        }
        const followDao = this.factory.getFollowDao();
        return await followDao.isFollower(currentUser.alias, displayedUser.alias);
    }

    public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
        const followDao = this.factory.getFollowDao();
        return await followDao.getFolloweeCount(user.alias);
    }

    public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
        const followDao = this.factory.getFollowDao();
        return await followDao.getFollowerCount(user.alias);
    }

    public async followUser(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        const authTokenDao = this.factory.getAuthTokenDao();
        const tokenData = await authTokenDao.getAuthToken(authToken.token);
        if (!tokenData) throw new Error("Not authorized");

        const followDao = this.factory.getFollowDao();
        await followDao.putFollow(tokenData.alias, userToFollow.alias);

        const followerCount = await this.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
        return [followerCount, followeeCount];
    }

    public async unfollowUser(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        const authTokenDao = this.factory.getAuthTokenDao();
        const tokenData = await authTokenDao.getAuthToken(authToken.token);
        if (!tokenData) throw new Error("Not authorized");

        const followDao = this.factory.getFollowDao();
        await followDao.deleteFollow(tokenData.alias, userToUnfollow.alias);

        const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
        return [followerCount, followeeCount];
    }
}
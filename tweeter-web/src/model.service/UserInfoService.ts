import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "./net/ServerFacade";

export class UserInfoService {
    private serverFacade = new ServerFacade();

    public async getIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ): Promise<boolean> {
        if (currentUser.equals(displayedUser)) return false;
        return this.serverFacade.getIsFollowerStatus({
            token: authToken.token,
            currentUser: currentUser.Dto,
            displayedUser: displayedUser.Dto
        });
    }

    public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
        return this.serverFacade.getFolloweeCount({
            token: authToken.token,
            user: user.Dto
        });
    }

    public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
        return this.serverFacade.getFollowerCount({
            token: authToken.token,
            user: user.Dto
        });
    }

    public async followUser(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.followUser({
            token: authToken.token,
            user: userToFollow.Dto
        });
    }

    public async unfollowUser(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.unfollowUser({
            token: authToken.token,
            user: userToUnfollow.Dto
        });
    }
}
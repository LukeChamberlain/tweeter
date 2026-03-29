import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";

export class PostStatusService extends Service {
    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        const statusDao = this.factory.getStatusDao();
        const followDao = this.factory.getFollowDao();
        const authTokenDao = this.factory.getAuthTokenDao();
        const tokenData = await authTokenDao.getAuthToken(authToken.token);
        if (!tokenData) throw new Error("Not authorized");
        await statusDao.putStatus(newStatus);
        let lastAlias: string | null = null;
        let hasMore = true;
        while (hasMore) {
          const [followerAliases, more] = await followDao.getFollowers(
              tokenData.alias,
              25,
              lastAlias
          );

          await Promise.all(
              followerAliases.map(alias => statusDao.putFeedItems(alias, [newStatus]))
          );

          hasMore = more;
          lastAlias = followerAliases.length > 0
              ? followerAliases[followerAliases.length - 1]
              : null;
      }
    }
}
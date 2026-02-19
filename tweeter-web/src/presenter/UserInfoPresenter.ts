import { AuthToken, User } from "tweeter-shared";
import { UserInfoService } from "../model.service/UserInfoService";
import { MessageView, Presenter } from "./presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: UserInfoService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new UserInfoService();
  }

  public async loadUserInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportOperation(async () => {
      const isFollower = await this.service.getIsFollowerStatus(
        authToken,
        currentUser,
        displayedUser
      );
      this.view.setIsFollower(isFollower);

      const followeeCount = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
      this.view.setFolloweeCount(followeeCount);

      const followerCount = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
      this.view.setFollowerCount(followerCount);
    }, "load user info");
  }

  //The following is the template method pattern, where you define the skeleton of an algorithm in one method, 
  //and let subclasses or parameters fill in the specific steps. Here updateFollowStatus defines the common steps for both followUser and unfollowUser
  

  private async updateFollowStatus(
    authToken: AuthToken,
    displayedUser: User,
    isFollowing: boolean
  ): Promise<void> {
    const action = isFollowing ? "follow" : "unfollow";
    const message = isFollowing ? `Following` : `Unfollowing`;
    let toast = "";

    await this.doFailureReportOperation(async () => {
      this.view.setIsLoading(true);
      toast = this.view.displayInfoMessage(
        `${message} ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = isFollowing
        ? await this.service.followUser(authToken, displayedUser)
        : await this.service.unfollowUser(authToken, displayedUser);

      this.view.setIsFollower(isFollowing);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, `${action} user`);

    this.view.deleteMessage(toast);
    this.view.setIsLoading(false);
  }

  public async followUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.updateFollowStatus(authToken, displayedUser, true);
  }

  public async unfollowUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.updateFollowStatus(authToken, displayedUser, false);
  }
}

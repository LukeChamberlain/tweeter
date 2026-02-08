import { AuthToken, User } from "tweeter-shared";
import { UserInfoService } from "../model.service/UserInfoService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private service: UserInfoService;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.service = new UserInfoService();
  }

  public async loadUserInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    try {
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
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load user info because of exception: ${error}`
      );
    }
  }

  public async followUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    let followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.followUser(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  }

  public async unfollowUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    let unfollowingUserToast = "";

    try {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.unfollowUser(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  }
}
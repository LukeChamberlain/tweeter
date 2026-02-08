import { User, AuthToken } from "tweeter-shared";
import { UserInfoStorageService, UserInfo } from "../model.service/UserInfoProviderService";

export interface UserInfoProviderView {
  setUserInfo: (userInfo: UserInfo) => void;
}

export class UserInfoProviderPresenter {
  private view: UserInfoProviderView;
  private storageService: UserInfoStorageService;

  public constructor(view: UserInfoProviderView) {
    this.view = view;
    this.storageService = new UserInfoStorageService();
  }

  public initializeUserInfo(): UserInfo {
    return this.storageService.retrieveFromLocalStorage();
  }

  public updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean = false
  ): void {
    const userInfo: UserInfo = {
      currentUser: currentUser,
      displayedUser: displayedUser,
      authToken: authToken,
    };

    this.view.setUserInfo(userInfo);

    if (remember) {
      this.storageService.saveToLocalStorage(currentUser, authToken);
    }
  }

  public clearUserInfo(): void {
    const userInfo: UserInfo = {
      currentUser: null,
      displayedUser: null,
      authToken: null,
    };

    this.view.setUserInfo(userInfo);
    this.storageService.clearLocalStorage();
  }

  public setDisplayedUser(user: User, currentUserInfo: UserInfo): UserInfo {
    return {
      ...currentUserInfo,
      displayedUser: user,
    };
  }
}
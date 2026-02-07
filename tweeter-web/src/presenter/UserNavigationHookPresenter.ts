import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  displayErrorMessage: (message: string) => void;
  navigateToUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    this.view = view;
    this.userService = new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async handleUserNavigation(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User | null
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(
        (event.target as HTMLAnchorElement).toString()
      );

      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser && !toUser.equals(currentUser!)) {
        this.view.navigateToUser(toUser);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
}
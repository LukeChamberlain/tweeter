import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./presenter";

export interface UserNavigationView extends View{
  navigateToUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
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
    await this.doFailureReportOperation(async () => {
      const alias = this.extractAlias(
        (event.target as HTMLAnchorElement).toString()
      );

      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser && !toUser.equals(currentUser!)) {
        this.view.navigateToUser(toUser);
      }
    }, "get user");
  }
}
import { AuthToken } from "tweeter-shared";
import { AppNavbarService } from "../model.service/AppNavBarService";

export interface AppNavbarView {
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class AppNavbarPresenter {
  private view: AppNavbarView;
  private service: AppNavbarService;

  public constructor(view: AppNavbarView) {
    this.view = view;
    this.service = new AppNavbarService();
  }

  public async handleLogout(authToken: AuthToken): Promise<void> {
    const loggingOutToastId = this.view.displayInfoMessage(
      "Logging Out...",
      0
    );

    try {
      await this.service.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }

  public isRouteActive(pathname: string, routePrefix: string): boolean {
    return this.isRouteActive(pathname, routePrefix);
  }
}
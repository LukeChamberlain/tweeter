import { AuthToken } from "tweeter-shared";
import { AppNavbarService } from "../model.service/AppNavBarService";
import { MessageView, Presenter} from "./presenter";
//eliminated the displayErrorMessage in the view it now comes through the presenter and it is used in the generic presenter class
//This uses the generic method that is created in the presenter
export interface AppNavbarView extends MessageView{
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView>{
  private _service: AppNavbarService;

  public constructor(view: AppNavbarView) {
    super(view);
    this._service = new AppNavbarService();
  }

  public get service() {
    return this._service;
  }

  public async handleLogout(authToken: AuthToken): Promise<void> {
    const loggingOutToastId = this.view.displayInfoMessage(
      "Logging Out...",
      0
    );
    await this.doFailureReportOperation(async () => {
      await this.service.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
  }, "log user out");
}
  
  

  public isRouteActive(pathname: string, routePrefix: string): boolean {
    return this.isRouteActive(pathname, routePrefix);
  }
}
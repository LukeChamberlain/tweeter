import { AuthToken, User } from "tweeter-shared";
import { LoginService } from "../model.service/LoginService";
import { Presenter, View } from "./presenter";
//eliminated the displayErrorMessage in the view it now comes through the presenter and it is used in the generic presenter class
//This uses the generic method that is created in the presenter
export interface LoginView extends View {
  setIsLoading: (isLoading: boolean) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private service: LoginService;

  public constructor(view: LoginView) {
    super(view);
    this.service = new LoginService();
  }

  public isLoginButtonDisabled(alias: string, password: string): boolean {
    return !this.isLoginFormValid(alias, password);
  }

  public isLoginFormValid(alias: string, password: string): boolean {
    return !!alias && !!password;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    updateUserInfo: (
      user: User,
      displayedUser: User,
      authToken: AuthToken,
      remember: boolean
    ) => void,
    navigate: (path: string) => void,
    originalUrl?: string
  ): Promise<void> {
    await this.doAuthenticationOperation(
      async () => {
        const [user, authToken] = await this.service.login(alias, password);
        updateUserInfo(user, user, authToken, rememberMe);
        if (!!originalUrl) {
          navigate(originalUrl);
        } else {
          navigate(`/feed/${user.alias}`);
        }
      },
      "log user in",
      this.view.setIsLoading.bind(this.view)
    );
  }
}

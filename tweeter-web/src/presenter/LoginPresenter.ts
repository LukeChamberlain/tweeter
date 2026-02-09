import { AuthToken, User } from "tweeter-shared";
import { LoginService } from "../model.service/LoginService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class LoginPresenter {
  private view: LoginView;
  private service: LoginService;

  public constructor(view: LoginView) {
    this.view = view;
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
    updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, remember: boolean) => void,
    navigate: (path: string) => void,
    originalUrl?: string
  ): Promise<void> {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.login(alias, password);

      updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        navigate(originalUrl);
      } else {
        navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
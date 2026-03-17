import { AuthToken, User } from "tweeter-shared";
import {
  AppNavbarView,
  AppNavbarPresenter,
} from "../../src/presenter/AppNavBarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { AppNavbarService } from "../../src/model.service/AppNavBarService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockService: AppNavbarService;

  const authToken = new AuthToken("fakeAuthToken", Date.now());

  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(
      mockAppNavbarPresenterView
    );

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarPresenterViewInstance)
    );
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockService = mock<AppNavbarService>();
    when(appNavbarPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.handleLogout(authToken);
    verify(
      mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)
    ).once();
  });

  it("calls logout on the user service with the correct auto token", async () => {
    await appNavbarPresenter.handleLogout(authToken);
    verify(mockService.logout(authToken)).once();
  });

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page.", async () => {
    await appNavbarPresenter.handleLogout(authToken);
    verify(mockAppNavbarPresenterView.deleteMessage(anything())).once();
    verify(mockAppNavbarPresenterView.clearUserInfo()).once();
    verify(mockAppNavbarPresenterView.navigate("/login")).once();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page.", async () => {
    let error = new Error("Failed to log out");
    when(mockService.logout(anything())).thenThrow(error);
    await appNavbarPresenter.handleLogout(authToken);
    verify(
      mockAppNavbarPresenterView.displayErrorMessage(
        "Failed to log user out because of exception: Error: Failed to log out"
      )
    ).once();
    verify(mockAppNavbarPresenterView.deleteMessage(anything())).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
    verify(mockAppNavbarPresenterView.navigate("/login")).never();
  });
});

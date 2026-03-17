import Login from "../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import UserEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify, anything} from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../src/presenter/LoginPresenter";
library.add(fab);

describe("Login Component", () => {
  it("starts with sign in button disabled", () => {
    const { signInButton } = renderLoginComponentAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("sign-in button is enabled when both the alias and password fields have text", async() => {
    const { signInButton, aliasField, passwordField, user } = renderLoginComponentAndGetElements("/");
    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");
    expect(signInButton).toBeEnabled();
  });

  it("sign-in button is disabled if either the alias or password field is cleared.", async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginComponentAndGetElements("/");

        await user.type(aliasField, "alias");
        await user.type(passwordField, "password");
        expect(signInButton).toBeEnabled();
        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();
        await user.type(aliasField, "alias");
        expect(signInButton).toBeEnabled();
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
  });

  it("The presenter's login method is called with correct parameters when the sign-in button is pressed.", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const orignalUrl = "http://example.com/original";
    const alias = "@alias";
    const password = "password";
    const { signInButton, aliasField, passwordField, user } = renderLoginComponentAndGetElements(orignalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);
    verify(mockPresenter.doLogin(alias, password, anything(), anything(), anything(), orignalUrl)).once();
   
  });
});

function renderLoginComponent(originalUrl?: string, presenter?: LoginPresenter) {
    return render(
      <MemoryRouter>
        {presenter ? (
          <Login originalUrl={originalUrl} presenter={presenter} />
        ) : (
          <Login originalUrl={originalUrl} />
        )}
      </MemoryRouter>
    );
  }

function renderLoginComponentAndGetElements(originalUrl?: string, presenter?: LoginPresenter) {
  const user = UserEvent.setup();
  renderLoginComponent(originalUrl, presenter);
  const signInButton = screen.getByRole("button", { name: /Sign In/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return {
    signInButton,
    aliasField,
    passwordField,
    user,
  };
}

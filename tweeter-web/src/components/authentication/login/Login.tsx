import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import {
  LoginView,
  LoginPresenter,
} from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const view: LoginView = useMemo(
    () => ({
      displayErrorMessage: (message: string) => displayErrorMessage(message),
      setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
    }),
    [displayErrorMessage]
  );

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(view);
  }

  const checkSubmitButtonStatus = useCallback((): boolean => {
    return presenterRef.current!.isLoginButtonDisabled(alias, password);
  }, [alias, password]);

  const loginOnEnter = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" && !checkSubmitButtonStatus()) {
        doLogin();
      }
    },
    [checkSubmitButtonStatus]
  );

  const doLogin = useCallback(async () => {
    await presenterRef.current!.doLogin(
      alias,
      password,
      rememberMe,
      updateUserInfo,
      (path: string) => navigate(path),
      props.originalUrl
    );
  }, [
    alias,
    password,
    rememberMe,
    updateUserInfo,
    navigate,
    props.originalUrl,
  ]);

  const inputFieldFactory = () => (
    <AuthenticationFields
      alias={alias}
      password={password}
      onAliasChange={setAlias}
      onPasswordChange={setPassword}
      onEnter={() => {
        if (!checkSubmitButtonStatus()) {
          doLogin();
        }
      }}
    />
  );

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;

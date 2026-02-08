import { useCallback, useMemo, useState, useRef } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";
import {
  UserInfoProviderPresenter,
  UserInfoProviderView,
} from "../../presenter/UserInfoProviderPresenter";
import { UserInfo } from "../../model.service/UserInfoProviderService";

interface Props {
  children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    const presenterForInit = new UserInfoProviderPresenter({
      setUserInfo: () => {},
    });
    return presenterForInit.initializeUserInfo();
  });

  const view: UserInfoProviderView = useMemo(
    () => ({
      setUserInfo: (userInfo: UserInfo) => setUserInfo(userInfo),
    }),
    []
  );

  const presenterRef = useRef<UserInfoProviderPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserInfoProviderPresenter(view);
  }

  const updateUserInfo = useCallback(
    (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean = false
    ) => {
      presenterRef.current!.updateUserInfo(
        currentUser,
        displayedUser,
        authToken,
        remember
      );
    },
    []
  );

  const clearUserInfo = useCallback(() => {
    presenterRef.current!.clearUserInfo();
  }, []);

  const setDisplayedUser = useCallback((user: User) => {
    setUserInfo((previous) => {
      return presenterRef.current!.setDisplayedUser(user, previous);
    });
  }, []);

  const userInfoActions = useMemo(
    () => ({
      updateUserInfo,
      clearUserInfo,
      setDisplayedUser,
    }),
    [updateUserInfo, clearUserInfo, setDisplayedUser]
  );

  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoActionsContext.Provider value={userInfoActions}>
        {children}
      </UserInfoActionsContext.Provider>
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
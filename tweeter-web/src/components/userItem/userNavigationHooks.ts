import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationHookPresenter";

interface UseUserNavigationProps {
  authToken: AuthToken | null;
  displayedUser: User | null;
  setDisplayedUser: (user: User) => void;
  featurePath: string;
  displayErrorMessage: (message: string) => void;
}

export const useUserNavigation = ({
  authToken,
  displayedUser,
  setDisplayedUser,
  featurePath,
  displayErrorMessage,
}: UseUserNavigationProps) => {
  const navigate = useNavigate();

  const view: UserNavigationView = useMemo(
    () => ({
      displayErrorMessage: (message: string) => displayErrorMessage(message),
      navigateToUser: (user: User) => {
        setDisplayedUser(user);
        navigate(`${featurePath}/${user.alias}`);
      },
    }),
    [displayErrorMessage, featurePath, navigate, setDisplayedUser]
  );

  const presenter = useMemo(() => new UserNavigationPresenter(view), [view]);

  const navigateToUser = useCallback(
    async (event: React.MouseEvent): Promise<void> => {
      if (!authToken) return;
      await presenter.handleUserNavigation(event, authToken, displayedUser);
    },
    [authToken, displayedUser, presenter]
  );

  return { navigateToUser };
};

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";

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

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with real API call
    return FakeData.instance.findUserByAlias(alias);
  };

  const navigateToUser = useCallback(
    async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      try {
        if (!authToken) return;

        const alias = extractAlias(
          (event.target as HTMLAnchorElement).toString()
        );

        const toUser = await getUser(authToken, alias);

        if (toUser && !toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      } catch (error) {
        displayErrorMessage(
          `Failed to get user because of exception: ${error}`
        );
      }
    },
    [
      authToken,
      displayedUser,
      featurePath,
      navigate,
      setDisplayedUser,
      displayErrorMessage,
    ]
  );

  return { navigateToUser };
};

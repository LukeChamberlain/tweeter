import "./UserInfoComponent.css";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import {
  UserInfoPresenter,
  UserInfoView,
} from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();
  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();
  const presenterRef = useRef<UserInfoPresenter | null>(null);

  if (!displayedUser && currentUser) {
    setDisplayedUser(currentUser);
  }

  const view: UserInfoView = useMemo(
    () => ({
      displayErrorMessage: (message: string) =>
        displayErrorMessage(message),
      displayInfoMessage: (message: string, duration: number) =>
        displayInfoMessage(message, duration),
      deleteMessage: (messageId: string) => deleteMessage(messageId),
      setIsFollower: (isFollower: boolean) => setIsFollower(isFollower),
      setFolloweeCount: (count: number) => setFolloweeCount(count),
      setFollowerCount: (count: number) => setFollowerCount(count),
      setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
    }),
    [displayErrorMessage, displayInfoMessage, deleteMessage]
  );

  if (!presenterRef.current) {
    presenterRef.current = new UserInfoPresenter(view);
  }

  useEffect(() => {
    if (authToken && currentUser && displayedUser) {
      presenterRef.current!.loadUserInfo(authToken, currentUser, displayedUser);
    }
  }, [displayedUser?.alias, authToken, currentUser?.alias]);

  const switchToLoggedInUser = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();
      setDisplayedUser(currentUser!);
      navigate(`${getBaseUrl()}/${currentUser!.alias}`);
    },
    [currentUser, navigate, setDisplayedUser, location.pathname]
  );

  const getBaseUrl = useCallback((): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }, [location.pathname]);

  const followDisplayedUser = useCallback(
    async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();
      if (authToken && displayedUser) {
        await presenterRef.current!.followUser(authToken, displayedUser);
      }
    },
    [authToken, displayedUser]
  );

  const unfollowDisplayedUser = useCallback(
    async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();
      if (authToken && displayedUser) {
        await presenterRef.current!.unfollowUser(authToken, displayedUser);
      }
    },
    [authToken, displayedUser]
  );

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={unfollowDisplayedUser}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={followDisplayedUser}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
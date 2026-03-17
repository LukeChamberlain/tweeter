import { User } from "tweeter-shared";
import UserItem from "../userItem/UserItem";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
import { PageItemView } from "../../presenter/PageItemPresenter";
import ItemScroller from "./ItemScroller";

interface Props {
  featurePath: string;
  presenterFactory: (listener: PageItemView<User>) => UserItemPresenter;
}

const UserItemScroller = ({ featurePath, presenterFactory }: Props) => (
  <ItemScroller
    featurePath={featurePath}
    presenterFactory={presenterFactory}
    renderItem={(user, path) => <UserItem user={user} featurePath={path} />}
  />
);

export default UserItemScroller;

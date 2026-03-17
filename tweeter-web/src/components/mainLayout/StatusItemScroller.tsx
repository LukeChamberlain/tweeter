import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/statusItem";
import { StatusItemPresenter } from "../../presenter/StatusItemPresenter";
import { PageItemView } from "../../presenter/PageItemPresenter";
import ItemScroller from "./ItemScroller";
//this is an example of Generic Types + Passing Functions as Parameters from item scroller
interface Props {
  featurePath: string;
  presenterFactory: (listener: PageItemView<Status>) => StatusItemPresenter;
}

const StatusItemScroller = ({ featurePath, presenterFactory }: Props) => (
  <ItemScroller
    featurePath={featurePath}
    presenterFactory={presenterFactory}
    renderItem={(status, path) => (
      <StatusItem status={status} user={status.user} featurePath={path} />
    )}
  />
);
export default StatusItemScroller;

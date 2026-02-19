import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE} from "./PageItemPresenter";


//This uses the generic method that is created in the presenter
export class FeedPresenter extends StatusItemPresenter {
  protected ItemDescription(): string {
    return " load feed items";
  }

  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }
}
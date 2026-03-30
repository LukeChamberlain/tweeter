import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE, PageItemView } from "./PageItemPresenter";
// StoryPresenter is a concrete implementation of the Template Method pattern defined in PageItemPresenter.
// PageItemPresenter.loadMoreItems() is the "template method" — it defines the skeleton of the algorithm
// (error handling, pagination state, updating the view) and delegates the variable parts to abstract
// methods that subclasses must implement:
//   - ItemDescription(): provides a label used in error reporting
//   - getMoreItems(): performs the actual data fetch

export class StoryPresenter extends StatusItemPresenter {

  protected ItemDescription(): string {
    return " load stories";
  }

  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}

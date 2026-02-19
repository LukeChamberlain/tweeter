import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE, PageItemView } from "./PageItemPresenter";
//This is using the template method pattern that comes from page Item presenter class and 
//the parts that very are the description and the get more items method. This is the presenter 
//for the story page and it uses the same method as the feed presenter but it just has a different 
//description and it calls a different method in the service to get the story items instead of the feed items.

export class StoryPresenter extends StatusItemPresenter {

  protected ItemDescription(): string {
    return " load stories";
  }

  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}

import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE, PageItemView } from "./PageItemPresenter";

//This uses the generic method that is created in the presenter
export class FolloweePresenter extends UserItemPresenter {
  protected ItemDescription(): string {
    return " load followees";
  }
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}

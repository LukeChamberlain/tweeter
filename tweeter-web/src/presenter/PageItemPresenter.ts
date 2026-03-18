import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./presenter";
import { Service } from "../../../tweeter-server/src/model/service/Service";
export const PAGE_SIZE = 10;

export interface PageItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PageItemPresenter<T, U extends Service> extends Presenter<
  PageItemView<T>
> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private userService: UserService;
  private _service: U;

  public constructor(view: PageItemView<T>) {
    super(view);
    this.userService = new UserService();
    this._service = this.serviceFactory();
  }

  protected abstract serviceFactory(): U;

  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }
  protected get service() {
    return this._service;
  }
  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, this.ItemDescription());
  }

  protected abstract ItemDescription(): string;

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[T[], boolean]>;

  reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return this.userService.getUser(authToken, alias);
  }
}

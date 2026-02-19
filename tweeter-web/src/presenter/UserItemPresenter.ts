import {User } from "tweeter-shared";
import { PageItemPresenter, PageItemView } from "./PageItemPresenter";
import { FollowService } from "../model.service/FollowService";
//eliminated the displayErrorMessage in the view it now comes through the PageItempresenter and it is used in the generic presenter class

export abstract class UserItemPresenter  extends PageItemPresenter <User, FollowService> {
  protected serviceFactory(): FollowService {
    return new FollowService();
  }
}

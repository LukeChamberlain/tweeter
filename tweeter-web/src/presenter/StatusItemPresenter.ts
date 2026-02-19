import {AuthToken, Status} from "tweeter-shared";
import { PageItemPresenter, PageItemView } from "./PageItemPresenter";
import { StatusService } from "../model.service/StatusService";
//eliminated the displayErrorMessage in the view it now comes through the presenter and it is used in the generic presenter class


export abstract class StatusItemPresenter extends PageItemPresenter<Status, StatusService> {
  protected serviceFactory(): StatusService {
    return new StatusService();
  }
}

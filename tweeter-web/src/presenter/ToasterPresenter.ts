import { ToasterService, ToastMessage } from "../model.service/ToasterService";

export interface ToasterView {
  deleteMessage: (messageId: string) => void;
}

export class ToasterPresenter {
  private view: ToasterView;
  private service: ToasterService;

  public constructor(view: ToasterView) {
    this.view = view;
    this.service = new ToasterService();
  }

  public deleteExpiredToasts(messageList: ToastMessage[]): void {
    const expiredIds = this.service.getExpiredToasts(messageList);

    for (let expiredId of expiredIds) {
      this.view.deleteMessage(expiredId);
    }
  }
}
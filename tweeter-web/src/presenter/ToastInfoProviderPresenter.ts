import { Toast, ToastType } from "../components/toaster/Toast";
import { ToastInfoService } from "../model.service/ToastInfoProviderService";


export interface ToastInfoProviderView {
  setToastList: (toastList: Toast[]) => void;
}

export class ToastInfoPresenter {
  private view: ToastInfoProviderView;
  private service: ToastInfoService;

  public constructor(view: ToastInfoProviderView) {
    this.view = view;
    this.service = new ToastInfoService();
  }

  public displayExistingToast(toast: Toast, currentList: Toast[]): void {
    const newList = this.service.addToastToList(toast, currentList);
    this.view.setToastList(newList);
  }

  public displayToast(
    toastType: ToastType,
    message: string,
    duration: number,
    currentList: Toast[],
    title?: string,
    bootstrapClasses?: string
  ): string {
    const toast = this.service.createToast(
      toastType,
      message,
      duration,
      title,
      bootstrapClasses
    );
    const newList = this.service.addToastToList(toast, currentList);
    this.view.setToastList(newList);
    return toast.id;
  }

  public deleteToast(id: string, currentList: Toast[]): void {
    const newList = this.service.removeToastFromList(id, currentList);
    this.view.setToastList(newList);
  }

  public deleteAllToasts(): void {
    const newList = this.service.clearAllToasts();
    this.view.setToastList(newList);
  }
}
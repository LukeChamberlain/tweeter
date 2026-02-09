import { ToastType, Toast, makeToast } from "../components/toaster/Toast";


export class ToastInfoService {
  public createToast(
    toastType: ToastType,
    message: string,
    duration: number,
    title?: string,
    bootstrapClasses?: string
  ): Toast {
    return makeToast(toastType, message, duration, title, bootstrapClasses);
  }

  public addToastToList(toast: Toast, toastList: Toast[]): Toast[] {
    return [...toastList, toast];
  }

  public removeToastFromList(id: string, toastList: Toast[]): Toast[] {
    return toastList.filter((x) => x.id !== id);
  }

  public clearAllToasts(): Toast[] {
    return [];
  }
}
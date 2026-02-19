export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}
//This is an example of a generic that extends view because there is no addItems method. This so it can be used by both UserItemPresenter and StatusItemPresenter
export abstract class Presenter<V extends View> {
  private _view: V;
  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportOperation(
    operation: () => Promise<void>,
    operationDiscription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDiscription} because of exception: ${error}`
      );
    }
  }

  protected async doAuthenticationOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    setIsLoading: (isLoading: boolean) => void
  ): Promise<void> {
    await this.doFailureReportOperation(async () => {
      setIsLoading(true);
      await operation();
    }, operationDescription);
    setIsLoading(false);
  }
}

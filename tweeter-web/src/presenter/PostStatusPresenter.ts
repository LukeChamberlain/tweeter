import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusService } from "../model.service/PostStatusService";
import { MessageView, Presenter } from "./presenter";
//eliminated the displayErrorMessage in the view it now comes through the presenter and it is used in the generic presenter class
//This uses the generic method that is created in the presenter
export interface PostStatusView extends MessageView{
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: PostStatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new PostStatusService();
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ): Promise<void> {
    let postingStatusToastId = "";
    await this.doFailureReportOperation(async () => {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser, Date.now());

      await this.service.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
    this.view.deleteMessage(postingStatusToastId);
    this.view.setIsLoading(false);
  }

  public isPostButtonDisabled(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ): boolean {
    return !this.isPostValid(post, authToken, currentUser !== null);
  }

  public isPostValid(
    post: string,
    authToken: AuthToken | null,
    currentUserExists: boolean
  ): boolean {
    return post.trim().length > 0 && authToken !== null && currentUserExists;
  }

  public clearPost(): void {
    this.view.setPost("");
  }
}

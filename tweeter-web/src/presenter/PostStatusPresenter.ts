import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusService } from "../model.service/PostStatusService";

export interface PostStatusView {
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private service: PostStatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.service = new PostStatusService();
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ): Promise<void> {
    let postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser, Date.now());

      await this.service.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }

  public isPostButtonDisabled(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ): boolean {
    return !this.service.isPostValid(
      post,
      authToken,
      currentUser !== null
    );
  }

  public clearPost(): void {
    this.view.setPost("");
  }
}
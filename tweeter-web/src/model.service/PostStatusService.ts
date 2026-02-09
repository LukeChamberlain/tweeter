import { AuthToken, Status } from "tweeter-shared";

export class PostStatusService {
  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the posting message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }

  public isPostValid(post: string, authToken: AuthToken | null, currentUserExists: boolean): boolean {
    return post.trim().length > 0 && authToken !== null && currentUserExists;
  }
}
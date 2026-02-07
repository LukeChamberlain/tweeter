import { AuthToken, User } from "tweeter-shared";
import { UserService } from "./UserService";

export class UserNavigationService {
  private userService: UserService;

  public constructor() {
    this.userService = new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getAndValidateUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User | null
  ): Promise<User | null> {
    const alias = this.extractAlias(
      (event.target as HTMLAnchorElement).toString()
    );

    const toUser = await this.userService.getUser(authToken, alias);

    if (toUser && !toUser.equals(currentUser!)) {
      return toUser;
    }

    return null;
  }
}
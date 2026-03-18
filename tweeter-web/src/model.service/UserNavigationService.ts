import { AuthToken, User } from "tweeter-shared";
import { UserService } from "./UserService";
import { Service } from "../../../tweeter-server/src/model/service/Service";

export class UserNavigationService implements Service {
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

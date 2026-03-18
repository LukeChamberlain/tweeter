import { AuthToken, User, FakeData, Status } from "tweeter-shared";
import { Service } from "../../../tweeter-server/src/model/service/Service";

export class UserService implements Service {
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }
}

import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class AuthService implements Service {
  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("invalid-alias-or-password");
    }
    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // TODO: Invalidate token in DynamoDB
  }
}
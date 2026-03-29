import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import bcrypt from "bcryptjs";

export class AuthService extends Service {
    public async login(alias: string, password: string): Promise<[User, AuthToken]> {
        const userDao = this.factory.getUserDao();
        const authTokenDao = this.factory.getAuthTokenDao();

        const passwordHash = await userDao.getPasswordHash(alias);
        if (!passwordHash) {
            throw new Error("invalid-alias-or-password");
        }

        const isValid = await bcrypt.compare(password, passwordHash);
        if (!isValid) {
            throw new Error("invalid-alias-or-password");
        }

        const user = await userDao.getUser(alias);
        if (!user) {
            throw new Error("invalid-alias-or-password");
        }

        const authToken = AuthToken.Generate();
        await authTokenDao.putAuthToken(authToken, alias);

        return [user, authToken];
    }

    public async logout(authToken: AuthToken): Promise<void> {
        const authTokenDao = this.factory.getAuthTokenDao();
        await authTokenDao.deleteAuthToken(authToken.token);
    }

    public async validateToken(token: string): Promise<string> {
        const authTokenDao = this.factory.getAuthTokenDao();
        const tokenData = await authTokenDao.getAuthToken(token);

        if (!tokenData) {
            throw new Error("Unauthorized");
        }

        return tokenData.alias;
    }
}
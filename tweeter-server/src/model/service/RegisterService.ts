import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import bcrypt from "bcryptjs";

export class RegisterService extends Service {
    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Buffer,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        const userDao = this.factory.getUserDao();
        const authTokenDao = this.factory.getAuthTokenDao();
        const s3Dao = this.factory.getS3Dao();
        const imageStringBase64 = userImageBytes.toString("base64");
        const imageUrl = await s3Dao.putImage(
            `${alias}.${imageFileExtension}`,
            imageStringBase64
        );
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User(firstName, lastName, alias, imageUrl);
        await userDao.putUser(user, passwordHash);
        const authToken = AuthToken.Generate();
        await authTokenDao.putAuthToken(authToken, alias);
        return [user, authToken];
    }
}
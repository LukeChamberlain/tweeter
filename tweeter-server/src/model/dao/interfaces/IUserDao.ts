import { User } from "tweeter-shared";

export interface IUserDao {
    getUser(alias: string): Promise<User | null>;
    putUser(user: User, passwordHash: string): Promise<void>;
    getPasswordHash(alias: string): Promise<string | null>;
}
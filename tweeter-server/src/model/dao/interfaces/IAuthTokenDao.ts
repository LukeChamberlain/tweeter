import { AuthToken } from "tweeter-shared";

export interface IAuthTokenDao {
    putAuthToken(authToken: AuthToken, alias: string): Promise<void>;
    getAuthToken(token: string): Promise<{ alias: string, timestamp: number } | null>;
    deleteAuthToken(token: string): Promise<void>;
}
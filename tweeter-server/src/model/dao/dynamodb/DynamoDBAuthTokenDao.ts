import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import { IAuthTokenDao } from "../interfaces/IAuthTokenDao";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "AuthTokens";

export class DynamoDBAuthTokenDao implements IAuthTokenDao {
    async putAuthToken(authToken: AuthToken, alias: string): Promise<void> {
        await client.send(new PutCommand({
            TableName: TABLE,
            Item: {
                token: authToken.token,
                alias,
                timestamp: authToken.timestamp
            }
        }));
    }

    async getAuthToken(token: string): Promise<{ alias: string, timestamp: number } | null> {
        const result = await client.send(new GetCommand({
            TableName: TABLE,
            Key: { token }
        }));

        if (!result.Item) return null;

        return {
            alias: result.Item.alias,
            timestamp: result.Item.timestamp
        };
    }

    async deleteAuthToken(token: string): Promise<void> {
        await client.send(new DeleteCommand({
            TableName: TABLE,
            Key: { token }
        }));
    }
}
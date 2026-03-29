import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { IUserDao } from "../interfaces/IUserDao";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "Users";

export class DynamoDBUserDao implements IUserDao {
    async getUser(alias: string): Promise<User | null> {
        const result = await client.send(new GetCommand({
            TableName: TABLE,
            Key: { alias }
        }));

        if (!result.Item) return null;

        return new User(
            result.Item.firstName,
            result.Item.lastName,
            result.Item.alias,
            result.Item.imageUrl
        );
    }

    async putUser(user: User, passwordHash: string): Promise<void> {
        await client.send(new PutCommand({
            TableName: TABLE,
            Item: {
                alias: user.alias,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                passwordHash
            }
        }));
    }

    async getPasswordHash(alias: string): Promise<string | null> {
        const result = await client.send(new GetCommand({
            TableName: TABLE,
            Key: { alias }
        }));

        return result.Item ? result.Item.passwordHash : null;
    }
}
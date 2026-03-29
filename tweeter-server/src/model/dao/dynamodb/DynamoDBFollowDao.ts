import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { IFollowDao } from "../interfaces/IFollowDao";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "Follows";
const GSI = "followeeAlias-followerAlias-index";

export class DynamoDBFollowDao implements IFollowDao {
    async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
        await client.send(new PutCommand({
            TableName: TABLE,
            Item: { followerAlias, followeeAlias }
        }));
    }

    async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
        await client.send(new DeleteCommand({
            TableName: TABLE,
            Key: { followerAlias, followeeAlias }
        }));
    }

    async getFollowees(userAlias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
        const result = await client.send(new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: "followerAlias = :alias",
            ExpressionAttributeValues: { ":alias": userAlias },
            Limit: pageSize,
            ExclusiveStartKey: lastItem ? { followerAlias: userAlias, followeeAlias: lastItem } : undefined
        }));

        const aliases = (result.Items ?? []).map(item => item.followeeAlias);
        return [aliases, !!result.LastEvaluatedKey];
    }

    async getFollowers(userAlias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
        const result = await client.send(new QueryCommand({
            TableName: TABLE,
            IndexName: GSI,
            KeyConditionExpression: "followeeAlias = :alias",
            ExpressionAttributeValues: { ":alias": userAlias },
            Limit: pageSize,
            ExclusiveStartKey: lastItem ? { followeeAlias: userAlias, followerAlias: lastItem } : undefined
        }));

        const aliases = (result.Items ?? []).map(item => item.followerAlias);
        return [aliases, !!result.LastEvaluatedKey];
    }

    async getFollowerCount(userAlias: string): Promise<number> {
        const result = await client.send(new QueryCommand({
            TableName: TABLE,
            IndexName: GSI,
            KeyConditionExpression: "followeeAlias = :alias",
            ExpressionAttributeValues: { ":alias": userAlias },
            Select: "COUNT"
        }));

        return result.Count ?? 0;
    }

    async getFolloweeCount(userAlias: string): Promise<number> {
        const result = await client.send(new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: "followerAlias = :alias",
            ExpressionAttributeValues: { ":alias": userAlias },
            Select: "COUNT"
        }));

        return result.Count ?? 0;
    }

    async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
        const result = await client.send(new GetCommand({
            TableName: TABLE,
            Key: { followerAlias, followeeAlias }
        }));

        return !!result.Item;
    }
}
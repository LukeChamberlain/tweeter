import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { Status, User } from "tweeter-shared";
import { IStatusDao } from "../interfaces/IStatusDao";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const STORY_TABLE = "Story";
const FEED_TABLE = "Feed";

export class DynamoDBStatusDao implements IStatusDao {
    async putStatus(status: Status): Promise<void> {
        const params = {
            TableName: STORY_TABLE,
            Item: {
                alias: status.user.alias,
                timestamp: status.timestamp,
                post: status.post,
                authorAlias: status.user.alias,
                firstName: status.user.firstName,
                lastName: status.user.lastName,
                imageUrl: status.user.imageUrl
            }
        };
        await client.send(new PutCommand(params));
    }

    async getStory(alias: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
        const params: any = {
            TableName: STORY_TABLE,
            KeyConditionExpression: "alias = :alias",
            ExpressionAttributeValues: { ":alias": alias },
            Limit: pageSize,
            ScanIndexForward: false 
        };

        if (lastItem) {
            params.ExclusiveStartKey = {
                alias: lastItem.user.alias,
                timestamp: lastItem.timestamp
            };
        }

        const result = await client.send(new QueryCommand(params));
        const items = result.Items || [];
        const statuses = items.map(item => new Status(
            item.post,
            new User(item.firstName, item.lastName, item.authorAlias, item.imageUrl),
            item.timestamp
        ));

        const hasMore = !!result.LastEvaluatedKey;
        return [statuses, hasMore];
    }

    async getFeed(alias: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
        const params: any = {
            TableName: FEED_TABLE,
            KeyConditionExpression: "alias = :alias",
            ExpressionAttributeValues: { ":alias": alias },
            Limit: pageSize,
            ScanIndexForward: false 
        };

        if (lastItem) {
            params.ExclusiveStartKey = {
                alias: alias,
                timestamp: lastItem.timestamp
            };
        }

        const result = await client.send(new QueryCommand(params));
        const items = result.Items || [];
        const statuses = items.map(item => new Status(
            item.post,
            new User(item.firstName, item.lastName, item.authorAlias, item.imageUrl),
            item.timestamp
        ));

        const hasMore = !!result.LastEvaluatedKey;
        return [statuses, hasMore];
    }

    async putFeedItems(alias: string, statuses: Status[]): Promise<void> {
        const batches = [];
        for (let i = 0; i < statuses.length; i += 25) {
            batches.push(statuses.slice(i, i + 25));
        }

        for (const batch of batches) {
            const params = {
                RequestItems: {
                    [FEED_TABLE]: batch.map(status => ({
                        PutRequest: {
                            Item: {
                                alias: alias,
                                timestamp: status.timestamp,
                                post: status.post,
                                authorAlias: status.user.alias,
                                firstName: status.user.firstName,
                                lastName: status.user.lastName,
                                imageUrl: status.user.imageUrl
                            }
                        }
                    }))
                }
            };
            await client.send(new BatchWriteCommand(params));
        }
    }
}
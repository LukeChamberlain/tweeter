import { Status } from "tweeter-shared";

export interface IStatusDao {
    putStatus(status: Status): Promise<void>;
    getStory(alias: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]>;
    getFeed(alias: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]>;
    putFeedItems(alias: string, statuses: Status[]): Promise<void>;
}
export interface IFollowDao {
    putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    getFollowers(userAlias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]>;
    getFollowees(userAlias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]>;
    getFollowerCount(userAlias: string): Promise<number>;
    getFolloweeCount(userAlias: string): Promise<number>;
    isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
}
import {
  AuthToken,
  FollowRequest,
  FollowResponse,
  GetCountRequest,
  GetCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  PageStatusItemRequest,
  PageStatusItemResponse,
  PageUserItemRequest,
  PageUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  TweeterRequest,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://rcsfqnj6m8.execute-api.us-east-1.amazonaws.com/prod";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PageUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PageUserItemRequest,
      PageUserItemResponse
    >(request, "/follow/get-followees");

    const items =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success && items) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to get followees");
    }
  }

  public async getMoreFollowers(
    request: PageUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PageUserItemRequest,
      PageUserItemResponse
    >(request, "/follow/get-followers");

    const items =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success && items) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Failed to get followers");
    }
  }

  public async logout(request: TweeterRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      TweeterResponse
    >(request, "/auth/logout");

    if (!response.success) {
      throw new Error(response.message ?? "Failed to logout");
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/auth/login");

    if (response.success && response.user && response.authToken) {
      return [
        User.fromDto(response.user) as User,
        new AuthToken(response.authToken, Date.now()),
      ];
    } else {
      throw new Error(response.message ?? "Failed to login");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post");

    if (!response.success) {
      throw new Error(response.message ?? "Failed to post status");
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      LoginResponse
    >(request, "/auth/register");

    if (response.success && response.user && response.authToken) {
      return [
        User.fromDto(response.user) as User,
        new AuthToken(response.authToken, Date.now()),
      ];
    } else {
      throw new Error(response.message ?? "Failed to register");
    }
  }

  public async getMoreStoryItems(
    request: PageStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PageStatusItemRequest,
      PageStatusItemResponse
    >(request, "/status/get-story");
    const items =
      response.success && response.items
        ? response.items.map(
            (dto) =>
              new Status(dto.post, User.fromDto(dto.user)!, dto.timestamp)
          )
        : null;
    if (response.success && items) return [items, response.hasMore];
    throw new Error(response.message ?? "Failed to get story");
  }

  public async getMoreFeedItems(
    request: PageStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PageStatusItemRequest,
      PageStatusItemResponse
    >(request, "/status/get-feed");
    const items =
      response.success && response.items
        ? response.items
            .filter((dto) => dto !== null)
            .map(
              (dto) =>
                new Status(dto.post, User.fromDto(dto.user)!, dto.timestamp)
            )
        : null;
    if (response.success && items) return [items, response.hasMore];
    throw new Error(response.message ?? "Failed to get feed");
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get-user");
    if (response.success)
      return response.user ? User.fromDto(response.user) : null;
    throw new Error(response.message ?? "Failed to get user");
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/is-follower");
    if (response.success) return response.isFollower;
    throw new Error(response.message ?? "Failed to get follower status");
  }

  public async getFollowerCount(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(request, "/follow/get-follower-count");
    if (response.success) return response.count;
    throw new Error(response.message ?? "Failed to get follower count");
  }

  public async getFolloweeCount(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(request, "/follow/get-followee-count");
    if (response.success) return response.count;
    throw new Error(response.message ?? "Failed to get followee count");
  }

  public async followUser(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/follow-user");
    if (response.success)
      return [response.followerCount, response.followeeCount];
    throw new Error(response.message ?? "Failed to follow user");
  }

  public async unfollowUser(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/unfollow-user");
    if (response.success)
      return [response.followerCount, response.followeeCount];
    throw new Error(response.message ?? "Failed to unfollow user");
  }
}

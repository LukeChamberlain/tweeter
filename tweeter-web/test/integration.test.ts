import "isomorphic-fetch";
import { AuthToken, User, Status } from "tweeter-shared";
import { ServerFacade } from "../src/model.service/net/ServerFacade";
import { StatusService } from "../src/model.service/StatusService";

let facade: ServerFacade;
let statusService: StatusService;
let authToken: AuthToken;
let allenUser: User;

const ALLEN_ALIAS = "@allen";
const ALLEN_FIRST = "Allen";
const ALLEN_LAST = "Anderson";

const DUMMY_IMAGE =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

beforeAll(async () => {
  facade = new ServerFacade();
  statusService = new StatusService();

  const [user, token] = await facade.register({
    firstName: ALLEN_FIRST,
    lastName: ALLEN_LAST,
    alias: ALLEN_ALIAS,
    password: "password",
    userImageBytes: DUMMY_IMAGE,
    imageFileExtension: "png",
    token: "",
  });

  allenUser = user;
  authToken = token;
}, 15_000);

describe("ServerFacade: register", () => {
  it("returns a User with the correct first and last name", () => {
    expect(allenUser.firstName).toBe(ALLEN_FIRST);
    expect(allenUser.lastName).toBe(ALLEN_LAST);
  });

  it("returns a User with the correct alias", () => {
    expect(allenUser.alias).toBe(ALLEN_ALIAS);
  });

  it("returns a non-null AuthToken with a non-empty token string", () => {
    expect(authToken).not.toBeNull();
    expect(authToken.token).toBeTruthy();
  });
});

describe("ServerFacade: getMoreFollowers", () => {
  let followers: User[];
  let hasMore: boolean;

  beforeAll(async () => {
    [followers, hasMore] = await facade.getMoreFollowers({
      token: authToken.token,
      userAlias: allenUser.alias,
      pageSize: 10,
      lastItem: null,
    });
  }, 15_000);

  it("returns a non-empty list of followers", () => {
    expect(followers).not.toBeNull();
    expect(followers.length).toBeGreaterThan(0);
  });

  it("returns User objects — each has a truthy alias starting with '@'", () => {
    for (const follower of followers) {
      expect(follower.alias).toBeTruthy();
      expect(follower.alias.startsWith("@")).toBe(true);
    }
  });

  it("returns User objects with a first and last name", () => {
    for (const follower of followers) {
      expect(follower.firstName).toBeTruthy();
      expect(follower.lastName).toBeTruthy();
    }
  });

  it("returns a boolean hasMore flag", () => {
    expect(typeof hasMore).toBe("boolean");
  });
});

describe("ServerFacade: getFollowerCount", () => {
  it("returns a follower count greater than zero for Allen Anderson", async () => {
    const count = await facade.getFollowerCount({
      token: authToken.token,
      user: allenUser.Dto
    });

    expect(count).toBeGreaterThan(0);
  }, 15_000);
});

describe("ServerFacade: getFolloweeCount", () => {
  it("returns a followee count greater than zero for Allen Anderson", async () => {
    const count = await facade.getFolloweeCount({
      token: authToken.token,
      user: allenUser.Dto
    });

    expect(count).toBeGreaterThan(0);
  }, 15_000);
});

describe("StatusService: loadMoreStoryItems", () => {
  let statuses: Status[];
  let hasMore: boolean;

  beforeAll(async () => {
    [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      allenUser.alias,
      10,
      null
    );
  }, 15_000);

  it("returns a non-empty list of statuses", () => {
    expect(statuses).not.toBeNull();
    expect(statuses.length).toBeGreaterThan(0);
  });

  it("each status has a non-empty post string", () => {
    for (const status of statuses) {
      expect(status.post).toBeTruthy();
    }
  });

  it("each status has a valid user with an alias", () => {
    for (const status of statuses) {
      expect(status.user).not.toBeNull();
      expect(status.user.alias).toBeTruthy();
    }
  });

  it("each status has a numeric timestamp", () => {
    for (const status of statuses) {
      expect(typeof status.timestamp).toBe("number");
    }
  });

  it("returns a boolean hasMore flag", () => {
    expect(typeof hasMore).toBe("boolean");
  });
});

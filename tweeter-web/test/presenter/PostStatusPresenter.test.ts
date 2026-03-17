import { AuthToken, User } from "tweeter-shared";
import {
  PostStatusView,
  PostStatusPresenter,
} from "../../src/presenter/PostStatusPresenter";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { PostStatusService } from "../../src/model.service/PostStatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: PostStatusService;

  const authToken = new AuthToken("fakeAuthToken", Date.now());
  const user = new User(
    "testUser",
    "Test",
    "User",
    "../../assets/images/donald_duck.png"
  );

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(
      mockPostStatusPresenterView
    );

    mockService = mock<PostStatusService>();

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusPresenterViewInstance)
    );
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));

    postStatusPresenter = instance(postStatusPresenterSpy);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost("Hello World!", user, authToken);
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost("Hello World!", user, authToken);
    verify(mockService.postStatus(authToken, anything())).once();
  });

  it("on successful post, tells the view to clear the info message, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost("Hello World!", user, authToken);

    verify(mockPostStatusPresenterView.deleteMessage(anything())).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });

  it("on failed post, tells the view to clear the info message and display an error, but does not clear the post or display a status posted message", async () => {
    const errorMessage = "Failed to post status";
    when(mockService.postStatus(anything(), anything())).thenReject(
      new Error(errorMessage)
    );
    await postStatusPresenter.submitPost("Hello World!", user, authToken);
    verify(mockPostStatusPresenterView.deleteMessage(anything())).once();
    verify(
      mockPostStatusPresenterView.displayErrorMessage(
        `Failed to post the status because of exception: Error: ${errorMessage}`
      )
    ).once();
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});

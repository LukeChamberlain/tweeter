import PostStatus from "../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import React from "react";
import UserEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useUserInfo } from "../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import "@testing-library/jest-dom"


jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
    ...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
    __esModule: true,
    useUserInfo: jest.fn(),
  })); 


describe("PostStatus Component", () => {
    const mockUser = mock(User);
    const mockAuthToken = mock(AuthToken);

    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: instance(mockUser),
            authToken: instance(mockAuthToken),
        });
    });


    it("starts with post status and clear buttons disabled", () => {
        const { postStatusButton, clearButton } = renderPostStatusComponentAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("both buttons are enabled when the text field has text", async () => {
        const { postStatusButton, clearButton, textArea, user } = renderPostStatusComponentAndGetElements();

        await user.type(textArea, "Hello World!");

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("both buttons are disabled when the text field is cleared", async () => {
        const { postStatusButton, clearButton, textArea, user } = renderPostStatusComponentAndGetElements();

        await user.type(textArea, "Hello World!");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        await user.clear(textArea);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
        const mockPresenter = mock(PostStatusPresenter);
        const mockPresenterInstance = instance(mockPresenter);
        const { postStatusButton, textArea, user } = renderPostStatusComponentAndGetElements(mockPresenterInstance);
        const postText = "Hello World!";
        await user.type(textArea, postText);
        await user.click(postStatusButton);
        verify(mockPresenter.submitPost(postText, instance(mockUser), instance(mockAuthToken))).once();

    });

});

function renderPostStatusComponent(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            <PostStatus presenter={presenter} />
        </MemoryRouter>
    );
}

function renderPostStatusComponentAndGetElements(presenter?: PostStatusPresenter) {
    const user = UserEvent.setup();
    renderPostStatusComponent(presenter);

    const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    const textArea = screen.getByPlaceholderText("What's on your mind?");

    return { postStatusButton, clearButton, textArea, user };
}
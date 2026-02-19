import { AuthToken, User } from "tweeter-shared";
import { RegisterService } from "../model.service/RegisterService";
import Register from "../components/authentication/register/Register";
import { Presenter, View } from "./presenter";

export interface RegisterView extends View {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (extension: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  private service: RegisterService;

  public constructor(view: RegisterView) {
    super(view);
    this.service = new RegisterService();
  }

  public async handleImageFile(file: File | undefined): Promise<void> {
    if (file) {
      await this.doFailureReportOperation(async () => {
        this.view.setImageUrl(URL.createObjectURL(file));

        const imageBytes = await this.service.convertFileToImageBytes(file);
        this.view.setImageBytes(imageBytes);

        const fileExtension = this.service.getFileExtension(file);
        if (fileExtension) {
          this.view.setImageFileExtension(fileExtension);
        }
      }, "process image");
    } else {
      this.clearImage();
    }
  }

  private clearImage(): void {
    this.view.setImageUrl("");
    this.view.setImageBytes(new Uint8Array());
    this.view.setImageFileExtension("");
  }

  public isRegistrationButtonDisabled(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return !this.service.isRegistrationFormValid(
      firstName,
      lastName,
      alias,
      password,
      imageUrl,
      imageFileExtension
    );
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean,
    updateUserInfo: (
      user: User,
      displayedUser: User,
      authToken: AuthToken,
      remember: boolean
    ) => void,
    navigate: (path: string) => void
  ): Promise<void> {
    await this.doAuthenticationOperation(
      async () => {
        const [user, authToken] = await this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        );
        updateUserInfo(user, user, authToken, rememberMe);
        navigate(`/feed/${user.alias}`);
      },
      "register user",
      this.view.setIsLoading.bind(this.view)
    );
  }
}

import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";

export class RegisterService {
  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async convertFileToImageBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const imageStringBase64 = event.target?.result as string;
          const imageStringBase64BufferContents =
            imageStringBase64.split("base64,")[1];
          const bytes: Uint8Array = Buffer.from(
            imageStringBase64BufferContents,
            "base64"
          );
          resolve(bytes);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  public isRegistrationFormValid(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return (
      !!firstName &&
      !!lastName &&
      !!alias &&
      !!password &&
      !!imageUrl &&
      !!imageFileExtension
    );
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not needed now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }
}
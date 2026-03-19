import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../../dto/UserDto";

export interface IsFollowerRequest extends TweeterRequest {
    readonly currentUser: UserDto;
    readonly displayedUser: UserDto;
}
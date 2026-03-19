import { TweeterRequest } from "./TweeterRequest";
import { UserDto } from "../../dto/UserDto";

export interface GetCountRequest extends TweeterRequest {
    readonly user: UserDto;
}
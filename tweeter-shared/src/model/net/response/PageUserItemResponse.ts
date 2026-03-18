import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface PageUserItemResponse extends TweeterResponse {
    readonly items: UserDto[] | null;
    readonly hasMore: boolean;
}

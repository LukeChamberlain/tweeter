import { TweeterResponse } from "./TweeterResponse";
import { StatusDto } from "../../dto/StatusDto";

export interface PageStatusItemResponse extends TweeterResponse {
    readonly items: StatusDto[] | null;
    readonly hasMore: boolean;
}
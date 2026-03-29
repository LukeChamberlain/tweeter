import { AuthToken, PageStatusItemRequest, PageStatusItemResponse, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (request: PageStatusItemRequest): Promise<PageStatusItemResponse> => {
    await new AuthService().validateToken(request.token);
    
    const statusService = new StatusService();
    const [items, hasMore] = await statusService.loadMoreStoryItems(
        new AuthToken(request.token, Date.now()),
        request.userAlias,
        request.pageSize,
        request.lastItem ? new Status(request.lastItem.post, User.fromDto(request.lastItem.user)!, request.lastItem.timestamp) : null
    );

    return {
        success: true,
        message: null,
        items: items.map(s => s.dto),
        hasMore
    }
}
import { Follow, PageUserItemRequest, PageUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (request: PageUserItemRequest): Promise<PageUserItemResponse> => {
    await new AuthService().validateToken(request.token);
    
    const followService = new FollowService();
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}
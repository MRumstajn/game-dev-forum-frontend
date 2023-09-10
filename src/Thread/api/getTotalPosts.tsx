import { GetTotalPostsResponse } from "./GetTotalPostsResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { TOTAL_POSTS_INFO_URL } from "../../common/Routes";

export async function getTotalPosts(
  threadId: number
): Promise<BaseResponseWrapper<GetTotalPostsResponse>> {
  const response = await fetch(`${TOTAL_POSTS_INFO_URL}/${threadId}`, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<GetTotalPostsResponse>;
}

import { SearchPostsRequest } from "./SearchPostsRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { PostResponse } from "../../common/api/PostResponse";
import { POST_SEARCH_URL } from "../../common/Routes";
import { PageResponseWrapper } from "../../forum/api/PageResponseWrapper";

export async function postPostSearchRequest(
  request: SearchPostsRequest
): Promise<BaseResponseWrapper<PageResponseWrapper<PostResponse>>> {
  const response = await fetch(POST_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<PageResponseWrapper<PostResponse>>;
}

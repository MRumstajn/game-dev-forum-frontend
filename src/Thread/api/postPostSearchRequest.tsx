import { SearchPostsRequest } from "./SearchPostsRequest";
import { PostResponse } from "../../common/api/PostResponse";
import { POST_SEARCH_URL } from "../../common/Routes";

export async function postPostSearchRequest(
  request: SearchPostsRequest
): Promise<PostResponse[]> {
  const response = await fetch(POST_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}

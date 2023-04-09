import { SearchLatestActivityPostRequest } from "./SearchLatestActivityPostRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { PostResponse } from "../../common/api/PostResponse";
import { POST_WITH_LATEST_ACTIVITY_URL } from "../../common/Routes";

export async function postSearchLatestActivityPostRequest(
  request: SearchLatestActivityPostRequest
): Promise<BaseResponseWrapper<PostResponse>> {
  const response = await fetch(POST_WITH_LATEST_ACTIVITY_URL, {
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
  } as BaseResponseWrapper<PostResponse>;
}

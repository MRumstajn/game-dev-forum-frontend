import { EditPostRequest } from "./EditPostRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { PostResponse } from "../../common/api/PostResponse";
import { POST_URL } from "../../common/Routes";

export async function postEditPostRequest(
  id: number,
  request: EditPostRequest
): Promise<BaseResponseWrapper<PostResponse>> {
  const response = await fetch(`${POST_URL}/${id}`, {
    method: "PUT",
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

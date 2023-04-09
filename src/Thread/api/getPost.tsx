import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { PostResponse } from "../../common/api/PostResponse";
import { POST_URL } from "../../common/Routes";

export async function getPost(
  id: number
): Promise<BaseResponseWrapper<PostResponse>> {
  const response = await fetch(`${POST_URL}/${id}`, { method: "GET" });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<PostResponse>;
}

import { TopPostResponse } from "./TopPostResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { POST_SEARCH_TOP_URL } from "../../common/Routes";

export async function getTopPostInThread(
  threadId: number
): Promise<BaseResponseWrapper<TopPostResponse>> {
  const response = await fetch(`${POST_SEARCH_TOP_URL}/${threadId}`, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<TopPostResponse>;
}

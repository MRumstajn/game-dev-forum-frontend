import { SearchLatestActivityThread } from "./SearchLatestActivityThread";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { THREAD_WITH_LATEST_ACTIVITY_URL } from "../../common/Routes";

export async function postSearchLatestActivityThreadRequest(
  request: SearchLatestActivityThread
): Promise<BaseResponseWrapper<ThreadResponse>> {
  const response = await fetch(THREAD_WITH_LATEST_ACTIVITY_URL, {
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
  } as BaseResponseWrapper<ThreadResponse>;
}

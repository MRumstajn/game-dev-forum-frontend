import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { THREAD_URL } from "../../common/Routes";

export async function getThreadById(
  id: number
): Promise<BaseResponseWrapper<ThreadResponse>> {
  const response = await fetch(`${THREAD_URL}/${id}`, { method: "GET" });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<ThreadResponse>;
}

import { BaseResponseWrapper } from "./BaseResponseWrapper";
import { EditThreadRequest } from "./EditThreadRequest";
import { ThreadResponse } from "./ThreadResponse";
import { THREAD_URL } from "../Routes";

export async function putEditThreadRequest(
  threadId: number,
  request: EditThreadRequest
): Promise<BaseResponseWrapper<ThreadResponse>> {
  const response = await fetch(`${THREAD_URL}/${threadId}`, {
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
  } as BaseResponseWrapper<ThreadResponse>;
}

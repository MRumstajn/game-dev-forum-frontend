import { MarkMessagesAsReadRequest } from "./MarkMessagesAsReadRequest";
import { MessageResponse } from "./MessageResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { MESSAGE_MARK_AS_READ_URL } from "../../common/Routes";

export async function postMarkMessagesAsReadRequest(
  request: MarkMessagesAsReadRequest
): Promise<BaseResponseWrapper<MessageResponse[]>> {
  const response = await fetch(MESSAGE_MARK_AS_READ_URL, {
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
  } as BaseResponseWrapper<MessageResponse[]>;
}

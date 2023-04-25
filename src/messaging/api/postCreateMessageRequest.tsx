import { CreateMessageRequest } from "./CreateMessageRequest";
import { MessageResponse } from "./MessageResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { MESSAGE_URL } from "../../common/Routes";

export async function postCreateMessageRequest(
  request: CreateMessageRequest
): Promise<BaseResponseWrapper<MessageResponse>> {
  const response = await fetch(MESSAGE_URL, {
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
  } as BaseResponseWrapper<MessageResponse>;
}

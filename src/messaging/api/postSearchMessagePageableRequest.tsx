import { MessageResponse } from "./MessageResponse";
import { SearchMessageRequestPageable } from "./SearchMessageRequestPageable";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { MESSAGE_SEARCH_URL } from "../../common/Routes";
import { PageResponseWrapper } from "../../forum/api/PageResponseWrapper";

export async function postSearchMessagePageableRequest(
  request: SearchMessageRequestPageable
): Promise<BaseResponseWrapper<PageResponseWrapper<MessageResponse>>> {
  const response = await fetch(MESSAGE_SEARCH_URL, {
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
  } as BaseResponseWrapper<PageResponseWrapper<MessageResponse>>;
}

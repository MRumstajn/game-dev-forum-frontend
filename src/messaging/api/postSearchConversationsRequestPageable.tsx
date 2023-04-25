import { ConversationResponse } from "./ConversationResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { PageableRequest } from "../../common/api/PageableRequest";
import { CONVERSATION_SEARCH_URL } from "../../common/Routes";
import { PageResponseWrapper } from "../../forum/api/PageResponseWrapper";

export async function postSearchConversationsRequestPageable(
  request: PageableRequest
): Promise<BaseResponseWrapper<PageResponseWrapper<ConversationResponse>>> {
  const response = await fetch(CONVERSATION_SEARCH_URL, {
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
  } as BaseResponseWrapper<PageResponseWrapper<ConversationResponse>>;
}

import { NotificationResponse } from "./NotificationResponse";
import { SearchNotificationRequest } from "./SearchNotificationRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { NOTIFICATION_SEARCH_URL } from "../../common/Routes";
import { PageResponseWrapper } from "../../forum/api/PageResponseWrapper";

export async function postSearchNotificationRequest(
  request: SearchNotificationRequest
): Promise<BaseResponseWrapper<PageResponseWrapper<NotificationResponse>>> {
  const response = await fetch(NOTIFICATION_SEARCH_URL, {
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
  } as BaseResponseWrapper<PageResponseWrapper<NotificationResponse>>;
}

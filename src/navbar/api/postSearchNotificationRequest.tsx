import { NotificationResponse } from "./NotificationResponse";
import { SearchNotificationRequest } from "./SearchNotificationRequest";
import { NOTIFICATION_SEARCH_URL } from "../../common/Routes";

export async function postSearchNotificationRequest(
  request: SearchNotificationRequest
): Promise<NotificationResponse[]> {
  const response = await fetch(NOTIFICATION_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}

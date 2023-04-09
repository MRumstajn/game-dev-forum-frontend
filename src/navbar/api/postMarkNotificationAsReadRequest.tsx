import { MarkNotificationsAsReadRequest } from "./MarkNotificationsAsReadRequest";
import { NotificationResponse } from "./NotificationResponse";
import { NOTIFICATION_MARK_AS_READ_URL } from "../../common/Routes";

export async function postMarkNotificationAsReadRequest(
  request: MarkNotificationsAsReadRequest
): Promise<NotificationResponse[]> {
  const response = await fetch(NOTIFICATION_MARK_AS_READ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}

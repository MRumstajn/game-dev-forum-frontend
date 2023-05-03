import { NotificationUnreadCountResponse } from "./NotificationUnreadCountResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { NOTIFICATION_UNREAD_COUNT_URL } from "../../common/Routes";

export async function getUnreadNotificationsCount(): Promise<
  BaseResponseWrapper<NotificationUnreadCountResponse>
> {
  const response = await fetch(NOTIFICATION_UNREAD_COUNT_URL, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<NotificationUnreadCountResponse>;
}

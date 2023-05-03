import { MarkNotificationsAsReadRequest } from "./MarkNotificationsAsReadRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { NOTIFICATION_MARK_AS_READ_URL } from "../../common/Routes";

export async function postMarkNotificationAsReadRequest(
  request: MarkNotificationsAsReadRequest
): Promise<BaseResponseWrapper<void>> {
  const response = await fetch(NOTIFICATION_MARK_AS_READ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return {
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<void>;
}

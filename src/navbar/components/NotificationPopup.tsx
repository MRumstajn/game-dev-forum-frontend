import React from "react";

import { IconButton, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { NotificationCard } from "./NotificationCard";
import { NotificationResponse } from "../api/NotificationResponse";

type NotificationPopupProps = {
  notifications: NotificationResponse[];

  markNotificationsAsReadCallback: (notificationIds: number[]) => void;
  markAllNotificationsAsReadCallback: () => void;
};

export function NotificationPopup({
  notifications,
  markAllNotificationsAsReadCallback,
  markNotificationsAsReadCallback,
}: NotificationPopupProps) {
  /*const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext.loggedInUser) {
      return;
    }

    postSearchNotificationRequest({
      recipientId: authContext.loggedInUser.id,
      sortPropertyList: [{ property: "isRead", direction: "DESC" }],
    }).then((response) => setNotifications(response));
  }, [authContext.loggedInUser]);*/

  /*function markNotificationsAsRead(notificationIds: number[]) {
    postMarkNotificationAsReadRequest({
      notificationIds: notificationIds,
    }).then((response) => {
      setNotifications((prevState) => {
        notificationIds.forEach((notificationId) => {
          const notificationIndex = prevState.findIndex(
            (notification) => notification.id === notificationId
          );

          if (notificationIndex !== -1) {
            prevState[notificationIndex].isRead = true;
          }
        });

        return [...prevState];
      });
    });
  }*/

  /*function markAllNotificationsAsRead() {
    markNotificationsAsRead(
      notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification.id)
    );
  }*/

  return (
    <div className="bg-slate-800 border-2 border-slate-700 w-80">
      <div className="flex flex-row justify-between bg-slate-700 p-1">
        <Typography variant="text" element="p">
          <strong className="text-white">Notifications</strong>
        </Typography>
        <IconButton
          icon={<Icon type="checks" />}
          onClick={() => markAllNotificationsAsReadCallback()}
          label="Mark all as read"
          disabled={
            notifications.find((notification) => !notification.isRead) ===
            undefined
          }
        />
      </div>

      <div className="flex flex-col mt-3 overflow-y-auto max-h-64">
        {notifications.map((notification) => (
          <NotificationCard
            notification={notification}
            markedAsReadCallback={(notificationId) =>
              markNotificationsAsReadCallback([notificationId])
            }
          />
        ))}
      </div>
    </div>
  );
}

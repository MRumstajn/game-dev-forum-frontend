import React, { useContext, useEffect, useRef, useState } from "react";

import { IconButton } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { NotificationPopup } from "./NotificationPopup";
import { AuthContext } from "../../common/components/AuthProvider";
import { NotificationResponse } from "../api/NotificationResponse";
import { postMarkNotificationAsReadRequest } from "../api/postMarkNotificationAsReadRequest";
import { postSearchNotificationRequest } from "../api/postSearchNotificationRequest";

export function NotificationBellMenu() {
  const [notificationsShown, setNotificationsShown] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );

  const popupRef = useRef<any>(null);
  const notificationBellRef = useRef<any>(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext.loggedInUser) {
      return;
    }

    postSearchNotificationRequest({
      recipientId: authContext.loggedInUser.id,
      sortPropertyList: [{ property: "isRead", direction: "DESC" }],
    }).then((response) => setNotifications(response.data));
  }, [authContext.loggedInUser]);

  useEffect(() => {
    function handleMouseClick(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !notificationBellRef.current.contains(event.target)
      ) {
        setNotificationsShown(false);
      }
    }

    window.addEventListener("mousedown", handleMouseClick);

    // cleanup
    return () => window.removeEventListener("mousedown", handleMouseClick);
  }, []);

  function markNotificationsAsRead(notificationIds: number[]) {
    postMarkNotificationAsReadRequest({
      notificationIds: notificationIds,
    }).then(() => {
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
  }

  function markAllNotificationsAsRead() {
    markNotificationsAsRead(
      notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification.id)
    );
  }

  function unreadNotificationsExist() {
    return (
      notifications.find((notification) => !notification.isRead) !== undefined
    );
  }

  return (
    <div className="relative items-center">
      <div ref={notificationBellRef}>
        <IconButton
          className="items-center text-center translate-y-1/4 my-auto"
          icon={
            <Icon
              type={unreadNotificationsExist() ? "bell-ringing" : "bell-simple"}
            />
          }
          onClick={() => setNotificationsShown((prevState) => !prevState)}
          label="Notifications"
        />
      </div>
      {notificationsShown && (
        <div className="absolute right-0 origin-top-right z-10" ref={popupRef}>
          <NotificationPopup
            markAllNotificationsAsReadCallback={markAllNotificationsAsRead}
            markNotificationsAsReadCallback={markNotificationsAsRead}
            notifications={notifications}
          />
        </div>
      )}
    </div>
  );
}

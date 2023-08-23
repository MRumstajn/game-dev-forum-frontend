import React from "react";

import { Button, IconButton, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { NotificationCard } from "./NotificationCard";
import { NotificationResponse } from "../api/NotificationResponse";

type NotificationPopupProps = {
  notifications: NotificationResponse[];
  markNotificationsAsReadCallback: (notificationIds: number[]) => void;
  markAllNotificationsAsReadCallback: () => void;
  loadNextPageCallback: () => void;
  hasMoreNotificationsToLoad: boolean;
  hasUnreadNotifications: boolean;
};

export function NotificationPopup({
  notifications,
  markAllNotificationsAsReadCallback,
  markNotificationsAsReadCallback,
  loadNextPageCallback,
  hasMoreNotificationsToLoad,
  hasUnreadNotifications,
}: NotificationPopupProps) {
  return (
    <div className="relative w-full nav-break:absolute nav-break:origin-top-right nav-break:right-0 bg-slate-800 border-2 border-slate-700 nav-break:w-80">
      <div className="flex flex-row justify-between bg-slate-700 p-1">
        <Typography variant="text" element="p">
          <strong className="text-white">Notifications</strong>
        </Typography>
        <IconButton
          icon={<Icon type="checks" />}
          onClick={() => markAllNotificationsAsReadCallback()}
          label="Mark all as read"
          disabled={!hasUnreadNotifications}
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
        {notifications.length === 0 && (
          <Typography variant="subtext" className="text-center p-3">
            <p>No notifications yet</p>
          </Typography>
        )}
        {notifications.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => loadNextPageCallback()}
            disabled={!hasMoreNotificationsToLoad}
          >
            Load more
          </Button>
        )}
      </div>
    </div>
  );
}

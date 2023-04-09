import React from "react";

import { IconButton, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { NotificationResponse } from "../api/NotificationResponse";

export type NotificationCardProps = {
  notification: NotificationResponse;

  markedAsReadCallback: (notificationId: number) => void;
};

export function NotificationCard({
  notification,
  markedAsReadCallback,
}: NotificationCardProps) {
  return (
    <>
      <div className="p-1 mb-1 flex flex-col gap-y-3 max-h-15 h-15">
        <div className="flex flex-row gap-x-1">
          <IconButton
            icon={
              <Icon type={notification.isRead ? "check-circle" : "circle"} />
            }
            disabled={notification.isRead}
            onClick={() => markedAsReadCallback(notification.id)}
            label="Mark as read"
          />
          <Typography variant="text" element="p">
            <span
              className={`${
                notification.isRead ? "text-slate-500" : "text-white"
              } underline`}
            >
              {notification.title}
            </span>
          </Typography>
        </div>
        <Typography variant="text" element="p">
          <span
            className={notification.isRead ? "text-slate-500" : "text-white"}
          >
            {notification.content}
          </span>
        </Typography>
      </div>
      <div className="w-full border-b last:border-0 mt-1 mb-1" />
    </>
  );
}

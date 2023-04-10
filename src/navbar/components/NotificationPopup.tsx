import React, { useState } from "react";

import { IconButton, Pagination, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { NotificationCard } from "./NotificationCard";
import { NotificationResponse } from "../api/NotificationResponse";

type NotificationPopupProps = {
  notifications: NotificationResponse[];
  markNotificationsAsReadCallback: (notificationIds: number[]) => void;
  markAllNotificationsAsReadCallback: () => void;
  changePageCallback: (page: number) => void;
  totalNotifications: number;
};

export function NotificationPopup({
  notifications,
  markAllNotificationsAsReadCallback,
  markNotificationsAsReadCallback,
  changePageCallback,
  totalNotifications,
}: NotificationPopupProps) {
  const [page, setPage] = useState<number>(0);

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
        <Pagination
          pageNumber={page}
          pageSize={3}
          totalElements={totalNotifications}
          onPageChange={(page) => {
            setPage(page);
            changePageCallback(page);
          }}
          tokens={{
            default: {
              backgroundColor: "none",
              textColor: "text-slate-600 hover:text-white",
              borderColor: "none",
            },
            current: {
              backgroundColor: "none hover:bg-navy-100",
              textColor: "text-white",
              borderColor: "border-none",
            },
            pageSummary: {
              fontSize: "text-sm",
              lineHeight: "leading-5",
            },
          }}
        >
          {() => <></>}
        </Pagination>
      </div>
    </div>
  );
}

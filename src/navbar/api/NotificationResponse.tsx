import { UserResponse } from "../../common/api/UserResponse";

export type NotificationResponse = {
  id: number;

  recipient: UserResponse;

  title: string;

  content: string;

  creationDate: Date;

  isRead: boolean;
};

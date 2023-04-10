import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchNotificationRequest = {
  recipientId?: number;

  isRead?: boolean;

  creationDate?: Date;
} & PageableRequest;

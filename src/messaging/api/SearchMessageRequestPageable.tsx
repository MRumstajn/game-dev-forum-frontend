import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchMessageRequestPageable = {
  id?: number;

  recipientId?: number;

  authorId?: number;

  isRead?: boolean;

  creationDateTime?: Date;

  conversationId?: number;
} & PageableRequest;

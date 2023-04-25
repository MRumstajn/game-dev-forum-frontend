import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchMessageSenderRequestPageable = {
  recipientId: number;
} & PageableRequest;

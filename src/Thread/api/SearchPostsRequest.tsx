import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchPostsRequest = {
  threadId?: number;

  authorId?: number;

  creationDateTimeFromIncluding?: Date;

  creationDateTimeToIncluding?: Date;
} & PageableRequest;

import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchPostsRequest = {
  threadId?: number;

  authorUsername?: string;

  authorId?: number;

  creationDateTimeFromIncluding?: Date;

  creationDateTimeToIncluding?: Date;

  likesFromIncluding?: number;

  dislikesFromIncluding?: number;
} & PageableRequest;

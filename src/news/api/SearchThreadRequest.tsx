import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchThreadRequest = {
  categoryId?: number;

  creationDateTimeFromIncluding?: Date;

  creationDateTimeToIncluding?: Date;

  title?: string;

  authorId?: number;

  authorUsername?: string;
} & PageableRequest;

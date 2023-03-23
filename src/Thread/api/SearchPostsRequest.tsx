export type SearchPostsRequest = {
  threadId?: number;

  authorId?: number;

  creationDateTimeFromIncluding?: Date;

  creationDateTimeToIncluding?: Date;
};

import { PostResponse } from "../../common/api/PostResponse";

export type ThreadStatisticsResponse = {
  threadId: number;

  postCount: number;

  latestPost: PostResponse;
};

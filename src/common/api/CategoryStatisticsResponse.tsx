import { ThreadResponse } from "./ThreadResponse";

export type CategoryStatisticsResponse = {
  categoryId: number;

  threadCount: number;

  threadWithLatestActivity: ThreadResponse;
};

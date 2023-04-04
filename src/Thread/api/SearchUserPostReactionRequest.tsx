import { PostReactionType } from "../../common/constants";

export type SearchUserPostReactionRequest = {
  userId?: number;

  postIds?: number[];

  postReactionType?: PostReactionType;
};

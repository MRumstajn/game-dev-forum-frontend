import { PostReactionCountResponse } from "./PostReactionCountResponse";
import { PostReactionType } from "../../common/constants";

export type UserPostReactionResponse = {
  id: number;

  postId: number;

  userId: number;

  postReactionType: PostReactionType;

  reactionTypesCount: PostReactionCountResponse[];
};

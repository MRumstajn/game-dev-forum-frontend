import { PostReactionType } from "../../common/constants";

export type PostReactionCountResponse = {
  postId: number;

  count: number;

  postReactionType: PostReactionType;
};

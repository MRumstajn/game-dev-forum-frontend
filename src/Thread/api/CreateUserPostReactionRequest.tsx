import { PostReactionType } from "../../common/constants";

export type CreateUserPostReactionRequest = {
  postId: number;

  postReactionType: PostReactionType;
};

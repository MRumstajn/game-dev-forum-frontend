import { PostResponse } from "../../common/api/PostResponse";

export type TopPostResponse = {
  pageNumber?: number;

  post: PostResponse;
};

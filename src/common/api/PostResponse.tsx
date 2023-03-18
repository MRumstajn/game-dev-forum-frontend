import { UserResponse } from "./UserResponse";

export type PostResponse = {
  id: number;

  author: UserResponse;

  content: string;

  creationDate: Date;

  threadId: number;

  likes: number;

  dislikes: number;
};

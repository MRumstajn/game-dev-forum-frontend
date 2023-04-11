import { ThreadResponse } from "./ThreadResponse";
import { UserResponse } from "./UserResponse";

export type PostResponse = {
  id: number;

  author: UserResponse;

  content: string;

  creationDateTime: Date;

  thread: ThreadResponse;
};

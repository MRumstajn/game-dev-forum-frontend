import { UserResponse } from "./UserResponse";

export type ThreadResponse = {
  id: number;

  categoryId: number;

  author: UserResponse;

  creationDateTime: Date;

  title: string;
};

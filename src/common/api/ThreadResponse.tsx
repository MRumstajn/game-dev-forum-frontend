import { UserResponse } from "./UserResponse";

export type ThreadResponse = {
  id: number;

  categoryId: number;

  author: UserResponse;

  creationDate: Date;

  title: string;
};

import { CategoryResponse } from "./CategoryResponse";
import { UserResponse } from "./UserResponse";

export type ThreadResponse = {
  id: number;

  category: CategoryResponse;

  author: UserResponse;

  creationDateTime: Date;

  title: string;
};

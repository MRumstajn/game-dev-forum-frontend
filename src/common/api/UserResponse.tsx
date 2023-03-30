import { UserRole } from "./UserRole";

export type UserResponse = {
  id: number;

  username: string;

  joinDate: Date;

  role: UserRole;
};

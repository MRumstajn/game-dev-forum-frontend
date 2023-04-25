import { UserResponse } from "../../common/api/UserResponse";

export type ConversationResponse = {
  id: number;

  participants: UserResponse[];
};

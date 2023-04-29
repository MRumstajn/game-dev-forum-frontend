import { ConversationResponse } from "./ConversationResponse";
import { UserResponse } from "../../common/api/UserResponse";

export type MessageResponse = {
  id: number;
  content: string;

  author: UserResponse;

  recipient: UserResponse;

  creationDateTime: Date;

  conversation: ConversationResponse;

  isRead: boolean;

  deleted: boolean;
};

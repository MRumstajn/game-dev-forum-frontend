import { UserResponse } from "../../common/api/UserResponse";

export type ConversationResponse = {
  id: number;

  participantA: UserResponse;

  participantB: UserResponse;

  unreadMessages: number;

  latestMessageDateTime: Date;
};

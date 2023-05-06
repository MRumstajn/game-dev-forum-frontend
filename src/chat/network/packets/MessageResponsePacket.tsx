import { Packet } from "./Packet";
import { UserResponse } from "../../../common/api/UserResponse";

export type MessageResponsePacket = {
  author: UserResponse;

  message: string;
} & Packet;

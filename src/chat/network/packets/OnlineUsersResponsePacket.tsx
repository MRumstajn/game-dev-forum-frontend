import { Packet } from "./Packet";
import { UserResponse } from "../../../common/api/UserResponse";

export type OnlineUsersResponsePacket = {
  onlineUsers: UserResponse[];
} & Packet;

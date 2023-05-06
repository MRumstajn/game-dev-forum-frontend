import { Packet } from "./Packet";
import { UserResponse } from "../../../common/api/UserResponse";

export type UserJoinPacket = {
  user: UserResponse;
} & Packet;

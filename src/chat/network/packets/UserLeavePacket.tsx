import { Packet } from "./Packet";
import { UserResponse } from "../../../common/api/UserResponse";

export type UserLeavePacket = {
  user: UserResponse;
} & Packet;

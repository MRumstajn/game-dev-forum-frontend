import { Packet } from "./Packet";

export type ErrorPacket = {
  errorMsg: string;
} & Packet;

import { Packet } from "./Packet";

export type LoginRequestPacket = {
  token: string;
} & Packet;

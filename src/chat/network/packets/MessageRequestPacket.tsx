import { Packet } from "./Packet";

export type MessageRequestPacket = {
  message: string;
} & Packet;

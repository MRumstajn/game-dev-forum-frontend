import { Packet } from "./Packet";

export type SystemMessagePacket = {
  message: string;
} & Packet;

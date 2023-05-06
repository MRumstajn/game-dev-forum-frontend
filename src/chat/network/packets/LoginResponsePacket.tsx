import { Packet } from "./Packet";

export type LoginResponsePacket = {
  status: "OK" | "INVALID_TOKEN";
} & Packet;

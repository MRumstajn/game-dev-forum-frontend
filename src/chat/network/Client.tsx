import { ErrorPacket } from "./packets/ErrorPacket";
import { LoginRequestPacket } from "./packets/LoginRequestPacket";
import { LoginResponsePacket } from "./packets/LoginResponsePacket";
import { MessageRequestPacket } from "./packets/MessageRequestPacket";
import { MessageResponsePacket } from "./packets/MessageResponsePacket";
import { Packet, PacketType } from "./packets/Packet";
import { SystemMessagePacket } from "./packets/SystemMessagePacket";

export type PacketListener = (packet: Packet) => void;

export class Client {
  startupListener: (() => void) | undefined;
  shutdownListener: (() => void) | undefined;
  packetListeners: PacketListener[];
  ws: WebSocket | undefined;

  constructor() {
    this.packetListeners = [];
    this.ws = undefined;
  }

  connect(ip: string, port: number) {
    this.ws = new WebSocket(`ws://${ip}:${port}`);
    this.ws.onopen = () => {
      if (this.startupListener) {
        this.startupListener();
      }
    };

    this.ws.onclose = () => {
      if (this.shutdownListener) {
        this.shutdownListener();
      }
    };

    this.ws.onmessage = (msg) => {
      const json = JSON.parse(msg.data);
      let packet: Packet;
      if (Object.keys(json).includes("type")) {
        packet = json as Packet;
        switch (packet.type) {
          case PacketType.LOGIN_RESPONSE:
            packet = packet as LoginResponsePacket;
            break;
          case PacketType.LOGIN_REQUEST:
            packet = packet as LoginRequestPacket;
            break;
          case PacketType.MESSAGE_RESPONSE:
            packet = packet as MessageResponsePacket;
            break;
          case PacketType.MESSAGE_REQUEST:
            packet = packet as MessageRequestPacket;
            break;
          case PacketType.ERROR:
            packet = packet as ErrorPacket;
            break;
          case PacketType.SYSTEM_MESSAGE:
            packet = packet as SystemMessagePacket;
            break;
        }

        this.packetListeners.forEach((listener) => listener(packet));
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.packetListeners = [];
    }
  }

  sendPacket(packet: Packet) {
    this.ws?.send(JSON.stringify(packet));
  }

  registerPacketListener(listener: PacketListener) {
    this.packetListeners.push(listener);
  }

  setStartupListener(listener: () => void) {
    this.startupListener = listener;
  }

  setShutdownListener(listener: () => void) {
    this.shutdownListener = listener;
  }
}

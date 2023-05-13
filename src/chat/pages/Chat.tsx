import { useCallback, useEffect, useState } from "react";

import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { InputField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { UserResponse } from "../../common/api/UserResponse";
import {
  INPUT_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
} from "../../common/constants";
import { getToken } from "../../util/jwtTokenUtils";
import { Client } from "../network/Client";
import { LoginRequestPacket } from "../network/packets/LoginRequestPacket";
import { LoginResponsePacket } from "../network/packets/LoginResponsePacket";
import { MessageRequestPacket } from "../network/packets/MessageRequestPacket";
import { MessageResponsePacket } from "../network/packets/MessageResponsePacket";
import { OnlineUsersRequestPacket } from "../network/packets/OnlineUsersRequestPacket";
import { OnlineUsersResponsePacket } from "../network/packets/OnlineUsersResponsePacket";
import { Packet, PacketType } from "../network/packets/Packet";
import { SystemMessagePacket } from "../network/packets/SystemMessagePacket";
import { UserJoinPacket } from "../network/packets/UserJoinPacket";

type Form = {
  message: string;
};

const formInitialValues = {
  message: "",
} as Form;

const formValidationSchema = yup.object({
  message: yup
    .string()
    .min(3, INPUT_TOO_SHORT_MESSAGE)
    .max(200, INPUT_TOO_LONG_MESSAGE)
    .nullable(),
});

export function Chat() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [clientReady, setClientReady] = useState<boolean>(false);
  const [client, setClient] = useState<Client>();

  const fetchOnlineUsers = useCallback(() => {
    client?.sendPacket({
      type: "ONLINE_USERS_REQUEST",
    } as OnlineUsersRequestPacket);
  }, [client]);

  const onPacketReceived = useCallback(
    (packet: Packet) => {
      switch (packet.type) {
        case PacketType.LOGIN_RESPONSE:
          if ((packet as LoginResponsePacket).status === "OK") {
            setClientReady(true);
            fetchOnlineUsers();
          }
          break;
        case PacketType.MESSAGE_RESPONSE:
          addToPackets(packet as MessageResponsePacket);
          break;
        case PacketType.SYSTEM_MESSAGE:
          addToPackets(packet as SystemMessagePacket);
          break;
        case PacketType.USER_JOIN:
          const joinPacket = packet as UserJoinPacket;
          addToPackets(joinPacket);
          break;
        case PacketType.USER_LEAVE:
          const leavePacket = packet as UserJoinPacket;
          addToPackets(leavePacket);
          removeFromUsers(leavePacket.user);
          break;
        case PacketType.ONLINE_USERS_RESPONSE:
          const onlineUsersPacket = packet as OnlineUsersResponsePacket;
          setUsers(onlineUsersPacket.onlineUsers);
          break;
      }
    },
    [fetchOnlineUsers]
  );

  function addToPackets(packet: Packet) {
    setPackets((prevState) => [...prevState, packet]);
  }

  function removeFromUsers(userToRemove: UserResponse) {
    setUsers((prevState) => [
      ...prevState.filter((user) => user.id !== userToRemove.id),
    ]);
  }

  useEffect(() => setClient(new Client()), []);

  useEffect(() => {
    if (client === undefined) {
      return;
    }

    setClient(client);
    client.setStartupListener(() => {
      client.sendPacket({
        type: PacketType.LOGIN_REQUEST,
        token: "" + getToken(),
      } as LoginRequestPacket);

      setClientReady(true);
    });
    client.setShutdownListener(() => {
      setClientReady(false);
    });
    client.registerPacketListener(onPacketReceived);
    client.connect("localhost", 10000);

    return () => {
      client?.disconnect();
    };
  }, [client, onPacketReceived]);

  function formSubmitHandler(form: Form) {
    if (clientReady && client !== undefined) {
      const requestPacket = {
        type: PacketType.MESSAGE_REQUEST,
        message: form.message,
      } as MessageRequestPacket;

      client.sendPacket({
        type: PacketType.MESSAGE_REQUEST,
        message: form.message,
      } as MessageRequestPacket);

      addToPackets(requestPacket as MessageResponsePacket);
    }
  }

  function packetToChatLine(packet: Packet) {
    if (packet.type === PacketType.MESSAGE_RESPONSE) {
      return (
        <Typography variant="text" element="p">
          <strong>({(packet as MessageResponsePacket).author.username})</strong>
          : {(packet as MessageResponsePacket).message}
        </Typography>
      );
    }

    if (packet.type === PacketType.SYSTEM_MESSAGE) {
      return (
        <Typography variant="subtext" element="p">
          <i>{(packet as SystemMessagePacket).message}</i>
        </Typography>
      );
    }

    if (packet.type === PacketType.USER_JOIN) {
      return (
        <div className="flex flex-row gap-x-1 items-center pt1">
          <i>
            <Icon type="arrow-circle-right" variant="thin" />{" "}
          </i>
          <Typography variant="subtext" element="p">
            <i>
              {(packet as UserJoinPacket).user.username} has joined the chat
            </i>
          </Typography>
        </div>
      );
    }

    if (packet.type === PacketType.USER_LEAVE) {
      return (
        <div className="flex flex-row gap-x-1 items-center pt1">
          <Typography variant="subtext" element="p">
            <i>
              <Icon type="arrow-circle-left" variant="thin" />
            </i>
          </Typography>
          <Typography variant="subtext" element="p">
            <i>{(packet as UserJoinPacket).user.username} has left the chat</i>
          </Typography>
        </div>
      );
    }
  }

  return (
    <>
      <div className="m-1 sm:m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>Chat</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex flex-col-reverse gap-y-3 sm:flex-row sm:gap-y-0 border-0 sm:border rounded-md mt-3 sm:mt-0">
              <div className="grow border-r border-l sm:border-l-0 border-b sm:border-b-0">
                <div className="bg-slate-300 border-b rounded-tl-md text-center">
                  <Typography variant="title" element="h4">
                    Chat
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <div className="p-3 flex flex-col gap-y-3 h-[500px] overflow-y-scroll break-all">
                    {packets.map((packet) => packetToChatLine(packet))}
                  </div>
                  <div className="mt-auto">
                    <Formik
                      initialValues={formInitialValues}
                      onSubmit={(values, { resetForm }) => {
                        formSubmitHandler(values);
                        resetForm();
                      }}
                      validationSchema={formValidationSchema}
                    >
                      {(formik) => (
                        <form onSubmit={formik.handleSubmit}>
                          <div className="flex flex-row">
                            <InputField
                              name="message"
                              className="flex-grow rounded-none"
                              tokens={{
                                master:
                                  "rounded-none rounded-bl-md border-l-0 border-r-0 border-b-0 w-full",
                              }}
                            />
                            <Button
                              variant="filled"
                              color="primary"
                              className="rounded-none"
                              type="submit"
                            >
                              Send
                            </Button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
              <div className="border rounded-tl-md rounded-tr-md sm:border-0">
                <div className="bg-slate-300 border-b rounded-tr-md rounded-tl-md sm:rounded-tl-none text-center px-3">
                  <Typography variant="title" element="h4">
                    Online users
                  </Typography>
                </div>
                <div className="p-3 flex flex-col gap-y-3 items-center h-[300px] sm:h-[530px] sm:justify-start overflow-scroll">
                  {users.map((user) => (
                    <div className="flex flex-row gap-x-1 mx-3 w-full">
                      <div className="flex flex-row gap-x-3 items-center justify-start">
                        <Link to={`/profile/${user.id}`}>
                          <div className="flex flex-row gap-x-3 items-center">
                            <Avatar
                              size="30"
                              name={user.username}
                              round={true}
                            />
                            <Typography variant="text" element="p">
                              {user.username}
                            </Typography>
                          </div>
                        </Link>
                        <Icon
                          type="circle"
                          variant="fill"
                          className="text-green-600"
                          size={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useCallback, useContext, useEffect, useState } from "react";

import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { InputField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { AuthContext } from "../../common/components/AuthProvider";
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
import { Packet, PacketType } from "../network/packets/Packet";

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
  const [chatLines, setChatLines] = useState<string[]>([]);
  const [clientReady, setClientReady] = useState<boolean>(false);
  const [client, setClient] = useState<Client>();

  const authContext = useContext(AuthContext);

  const messagePacketToChatLine = useCallback(
    (packet: MessageResponsePacket | MessageRequestPacket): string => {
      return packet.type === PacketType.MESSAGE_RESPONSE
        ? `(${(packet as MessageResponsePacket).author.username}): ${
            packet.message
          }`
        : `(${authContext.loggedInUser?.username}): ${packet.message}`;
    },
    [authContext.loggedInUser?.username]
  );

  const onPacketReceived = useCallback(
    (packet: Packet) => {
      switch (packet.type) {
        case PacketType.LOGIN_RESPONSE:
          if ((packet as LoginResponsePacket).status === "OK") {
            setClientReady(true);
          }

          break;
        case PacketType.MESSAGE_RESPONSE:
          setChatLines((prevState) => [
            ...prevState,
            messagePacketToChatLine(packet as MessageResponsePacket),
          ]);
      }
    },
    [messagePacketToChatLine]
  );

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

      setChatLines((prevState) => [
        ...prevState,
        messagePacketToChatLine(requestPacket),
      ]);
    }
  }

  return (
    <>
      <div className="m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>Chat</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="grid grid-cols-3 border rounded-md">
              <div className="col-span-2 border-r">
                <div className="bg-slate-300 border-b rounded-tl-md text-center">
                  <Typography variant="title" element="h4">
                    Chat
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <div className="p-3 flex flex-col gap-y-3 h-[500px]">
                    {chatLines.map((line) => (
                      <Typography variant="text" element="p">
                        {line}
                      </Typography>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Formik
                      initialValues={formInitialValues}
                      onSubmit={formSubmitHandler}
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
              <div className="col-span-1">
                <div className="bg-slate-300 border-b rounded-tr-md text-center">
                  <Typography variant="title" element="h4">
                    Online users
                  </Typography>
                </div>
                <div className="p-3 flex flex-col gap-y-3">
                  <p>user</p>
                  <p>user</p>
                  <p>user</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

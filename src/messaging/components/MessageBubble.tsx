import React from "react";

import { Card, IconButton, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import moment from "moment";

import { MessageResponse } from "../api/MessageResponse";

type MessageBubbleProps = {
  message: MessageResponse;
  showControls: boolean;
};

export function MessageBubble({ message, showControls }: MessageBubbleProps) {
  return (
    <Card
      tokens={{
        master: "w-1/2",
        container: {
          backgroundColor: "bg-gray-300",
        },
      }}
    >
      <Card.Header className="border-none">
        <Typography variant="text" element="p">
          <strong>{message.author.username}</strong>
        </Typography>
      </Card.Header>
      <Card.Body className="pl-3 pt-0 pr-0 pb-0 m-0">
        {message.content}
      </Card.Body>
      <Card.Footer className="border-none">
        <div className="flex flex-row justify-between">
          <Typography variant="subtext" element="p">
            <span className="text-xs">
              {moment(message.creationDateTime).format("DD.MM.yyyy (h:mm)")}
            </span>
          </Typography>
          {showControls && (
            <div className="flex flex-row gap-x-3">
              <IconButton
                icon={<Icon type="trash" size={5} className="text-gray-600" />}
                onClick={() => {}}
                label="Delete"
              ></IconButton>
            </div>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
}

import React from "react";

import { Card, IconButton, Link, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import moment from "moment";

import { UserResponse } from "../../common/api/UserResponse";
import { MessageResponse } from "../api/MessageResponse";

type MessageBubbleProps = {
  message: MessageResponse;
  showControls: boolean;
  deleteCallback: () => void;
  author: UserResponse;
};

export function MessageBubble({
  message,
  showControls,
  deleteCallback,
  author,
}: MessageBubbleProps) {
  return (
    <Card
      tokens={{
        master: "max-w-md",
        container: {
          backgroundColor: "bg-gray-300",
        },
      }}
    >
      <Card.Header className="border-none">
        <Link to={`/profile/${author.id}`}>
          <Typography variant="text" element="p">
            <strong>{message.author.username}</strong>
          </Typography>
        </Link>
      </Card.Header>
      <Card.Body className="pl-3 pt-0 pr-3 pb-0 m-0">
        {!message.deleted ? (
          <pre className="whitespace-normal">{message.content}</pre>
        ) : (
          <div className="flex flex-row justify-center gap-x-1 text-gray-400">
            <Icon type="trash" variant="fill" />
            <Typography variant="subtext" element="p">
              Message deleted
            </Typography>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="border-none">
        <div className="flex flex-row justify-between">
          <Typography variant="subtext" element="p" className="pr-3">
            <span className="text-xs">
              {moment(message.creationDateTime).format("DD.MM.yyyy (h:mm)")}
            </span>
          </Typography>
          {showControls && !message.deleted && (
            <div className="flex flex-row gap-x-3">
              <IconButton
                icon={<Icon type="trash" size={5} className="text-gray-600" />}
                onClick={() => deleteCallback()}
                label="Delete"
              ></IconButton>
            </div>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
}

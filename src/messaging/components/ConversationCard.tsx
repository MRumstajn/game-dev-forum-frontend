import { Card, Typography } from "@tiller-ds/core";

import moment from "moment";
import Avatar from "react-avatar";

import { UserResponse } from "../../common/api/UserResponse";

type ConversationCardProps = {
  user: UserResponse;
  latestPostDate: Date;
  unreadMessages: number;
  clickCallback: () => void;
};

export function ConversationCard({
  user,
  latestPostDate,
  unreadMessages,
  clickCallback,
}: ConversationCardProps) {
  return (
    <Card onClick={() => clickCallback()} className="cursor-pointer">
      <Card.Body>
        <div
          className="flex flex-row justify-between p-3"
          onClick={() => clickCallback()}
        >
          <div className="flex flex-row gap-x-3">
            <Avatar round={true} size="30" name={user.username} />
            {unreadMessages > 0 && (
              <div className="rounded-full flex justify-center items-center border-red-600 bg-red-600 text-white">
                <p>{unreadMessages}</p>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Typography variant="text" element="p">
              {moment(latestPostDate).format("DD.MM.yyyy")}
            </Typography>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

import { Card, Link, Typography } from "@tiller-ds/core";

import moment from "moment";
import Avatar from "react-avatar";

import { UserResponse } from "../../common/api/UserResponse";

type ConversationCardProps = {
  user: UserResponse | undefined;
  latestPostDate: Date;
  unreadMessages: number;
  clickCallback: () => void;
  selected: boolean;
};

export function ConversationCard({
  user,
  latestPostDate,
  unreadMessages,
  clickCallback,
  selected,
}: ConversationCardProps) {
  return (
    <Card onClick={() => clickCallback()} className="cursor-pointer">
      <Card.Body className={`bg-${selected ? "slate-300" : "white"}`}>
        <div
          className="flex flex-row justify-between p-3"
          onClick={() => clickCallback()}
        >
          <div className="flex flex-row gap-x-3 items-center">
            <Link className="flex flex-row gap-x-3" to={`/profile/${user?.id}`}>
              <Avatar round={true} size="30" name={user?.username} />
              <Typography variant="text" element="p">
                <span className={`${unreadMessages > 0 ? "font-bold" : ""}`}>
                  {user?.username}
                </span>
              </Typography>
            </Link>
            {unreadMessages > 0 && (
              <div className="rounded-full flex w-[20px] h-[20px] justify-center items-center border-red-600 bg-red-600 text-white">
                <div>
                  <p className="font-bold text-xs">
                    {unreadMessages < 10 ? unreadMessages : "9+"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Typography
              variant="text"
              element="p"
              className={unreadMessages > 0 ? "font-bold" : ""}
            >
              {moment(latestPostDate).format("DD.MM.yyyy")}
            </Typography>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

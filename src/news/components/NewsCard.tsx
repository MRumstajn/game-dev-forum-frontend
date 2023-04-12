import { Card, Link, Typography } from "@tiller-ds/core";

import { UserResponse } from "../../common/api/UserResponse";
import { formatDate } from "../../util/dateUtil";

type NewsCardProps = {
  id: number;

  title: string;

  creationDate: Date;

  author: UserResponse;
};

export function NewsCard({ id, title, creationDate, author }: NewsCardProps) {
  return (
    <Link
      to={`/news/${id}`}
      tokens={{
        master: "no-underline",
      }}
    >
      <Card>
        <Card.Body className="flex flex-row justify-between">
          <Typography variant="text" element="p">
            {title}
          </Typography>
          <div className="flex flex-row space-x-1">
            <Typography variant="subtext" element="p">
              by
            </Typography>
            <Link to={`/profile/${author.id}`}>
              <Typography variant="text" element="p">
                <span className="text-blue-800">{author.username}</span>
              </Typography>
            </Link>
            <Typography variant="subtext" element="p">
              on {formatDate(creationDate)}
            </Typography>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

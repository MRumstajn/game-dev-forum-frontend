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
    <Link to={`/news/${id}`}>
      <Card>
        <Card.Body className="flex flex-row justify-between">
          <Typography variant="text" element="p">
            {title}
          </Typography>
          <div className="flex flex-col space-y-3">
            <Typography variant="text" element="p">
              {formatDate(creationDate)}
            </Typography>
            <Link to={`/profile/${author.id}`}>
              <Typography variant="text" element="p">
                by {author.username}
              </Typography>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

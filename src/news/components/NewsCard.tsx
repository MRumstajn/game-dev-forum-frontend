import { Card, Link, Typography } from "@tiller-ds/core";

import { formatDate } from "../../util/dateUtil";

type NewsCardProps = {
  id: number;

  title: string;

  creationDate: Date;

  author: string;
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
            <Typography variant="text" element="p">
              by {author}
            </Typography>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

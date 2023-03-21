import { Card, Link, Typography } from "@tiller-ds/core";

import { useParams } from "react-router-dom";

import { formatDate } from "../../util/dateUtil";

type ThreadCardProps = {
  threadId: number;

  title: string;

  postCount?: number;

  latestPostDate?: Date;

  latestPostAuthor?: string;
};

export function ThreadCard({
  threadId,
  title,
  postCount,
  latestPostDate,
  latestPostAuthor,
}: ThreadCardProps) {
  const params = useParams();

  const categoryId = Number(params.categoryId);

  return (
    <Link to={`/forum/${categoryId}/${threadId}`}>
      <Card>
        <Card.Body>
          <div className="grid grid-cols-3">
            <Typography variant="text" element="p">
              {title}
            </Typography>
            <Typography variant="text" element="p">
              {postCount}
            </Typography>
            {latestPostDate && latestPostAuthor && (
              <div className="flex flex-col space-y-3">
                <Typography variant="text" element="p">
                  {formatDate(latestPostDate)}
                </Typography>
                <div className="flex flex-row space-x-1">
                  <Typography variant="subtext" element="p">
                    by
                  </Typography>
                  <Typography variant="text" element="p">
                    {latestPostAuthor}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

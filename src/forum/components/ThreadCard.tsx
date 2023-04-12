import { Card, Link, Typography } from "@tiller-ds/core";

import { useParams } from "react-router-dom";

import { UserResponse } from "../../common/api/UserResponse";
import { formatDate } from "../../util/dateUtil";

type ThreadCardProps = {
  threadId: number;

  title: string;

  author: UserResponse;

  postCount?: number;

  latestPostDate?: Date;

  latestPostAuthor?: UserResponse;
};

export function ThreadCard({
  threadId,
  title,
  author,
  postCount,
  latestPostDate,
  latestPostAuthor,
}: ThreadCardProps) {
  const params = useParams();

  const categoryId = Number(params.categoryId);

  return (
    <Link
      to={`/forum/${categoryId}/${threadId}`}
      tokens={{
        master: "no-underline",
      }}
    >
      <Card>
        <Card.Body>
          <div className="grid grid-cols-4">
            <Typography variant="text" element="p">
              {title}
            </Typography>
            <Typography variant="text" element="p">
              {postCount}
            </Typography>

            <Link to={`/profile/${author.id}`} className="w-1/3">
              <Typography variant="text" element="p">
                <span className="text-blue-800">{author.username}</span>
              </Typography>
            </Link>

            {latestPostDate && latestPostAuthor && (
              <div className="flex flex-row space-x-1">
                <Typography variant="subtext" element="p">
                  by
                </Typography>
                <Link to={`/profile/${latestPostAuthor.id}`}>
                  <Typography variant="text" element="p">
                    <span className="text-blue-800">
                      {latestPostAuthor.username}
                    </span>
                  </Typography>
                </Link>
                <Typography variant="subtext" element="p">
                  on {formatDate(latestPostDate)}
                </Typography>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

import { Card, Link, Typography } from "@tiller-ds/core";

import { useParams } from "react-router-dom";

import { UserResponse } from "../../common/api/UserResponse";
import { formatDate } from "../../util/dateUtil";
import { isScreenBelowMdBreakpoint } from "../../util/screenUtil";

type ThreadCardProps = {
  threadId: number;

  creationDate: Date;

  title: string;

  author: UserResponse;

  latestPostDate?: Date;

  latestPostAuthor?: UserResponse;

  showLatestPostLabel: boolean;
};

export function ThreadCard({
  threadId,
  creationDate,
  title,
  author,
  latestPostDate,
  latestPostAuthor,
  showLatestPostLabel,
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
          <div className="grid grid-cols-3 md:grid-cols-4">
            <Typography variant="text" element="p">
              {title}
            </Typography>

            <Link to={`/profile/${author.id}`} className="w-1/3">
              <Typography variant="text" element="p">
                <span className="text-blue-800">{author.username}</span>
              </Typography>
            </Link>

            <Typography variant="text" element="p">
              {formatDate(creationDate)}
            </Typography>

            {showLatestPostLabel && latestPostDate && latestPostAuthor && (
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

import { Card, Link, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { PostResponse } from "../../common/api/PostResponse";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { formatDate } from "../../util/dateUtil";

type ForumCategoryCardProps = {
  categoryId: number;

  title: string;

  threadCount?: number;

  threadWithLatestActivity?: ThreadResponse;

  latestPost?: PostResponse;
};

export function ForumCategoryCard({
  categoryId,
  title,
  threadCount,
  threadWithLatestActivity,
  latestPost,
}: ForumCategoryCardProps) {
  function getURLForThread(threadId: number): string {
    return `/forum/${categoryId}/${threadId}`;
  }

  return (
    <Link
      to={`/forum/${categoryId}`}
      tokens={{
        master: "no-underline",
      }}
    >
      <Card>
        <Card.Body>
          <div className="grid grid-cols-3">
            <Typography variant="text" element="p">
              {title}
            </Typography>
            <Typography variant="text" element="p">
              {threadCount}
            </Typography>
            <div className="flex flex-col space-y-1">
              {threadWithLatestActivity && latestPost && (
                <div>
                  <Link to={getURLForThread(threadWithLatestActivity.id)}>
                    <Typography variant="text" element="p">
                      {threadWithLatestActivity.title} on{" "}
                      {formatDate(latestPost.creationDateTime)}
                    </Typography>
                  </Link>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row space-x-1">
                      <Typography variant="subtext" element="p">
                        by
                      </Typography>
                      <Link
                        to={`/profile/${latestPost.author.id}`}
                        className="w-1/3"
                      >
                        <Typography variant="text" element="p">
                          <span className="text-blue-800">
                            {latestPost.author.username}
                          </span>
                        </Typography>
                      </Link>
                    </div>
                    <Link to={getURLForThread(threadWithLatestActivity.id)}>
                      <Icon type="arrow-right" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

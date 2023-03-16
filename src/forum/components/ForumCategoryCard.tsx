import { Card, Link, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { formatDate } from "../../util/dateUtil";

type ForumCategoryCardProps = {
  categoryId: number;

  title: string;

  threadCount: number;

  latestThreadPostBy: string;

  latestThreadPost: string;

  latestThreadPostDate: Date;

  threadWithLatestActivityId: number;
};

export function ForumCategoryCard({
  categoryId,
  title,
  threadCount,
  latestThreadPostBy,
  latestThreadPost,
  latestThreadPostDate,
  threadWithLatestActivityId,
}: ForumCategoryCardProps) {
  function getURLForThread(threadId: number): string {
    return `/forum/${categoryId}/${threadId}`;
  }

  return (
    <Link to={`/forum/${categoryId}`}>
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
              <Link to={getURLForThread(threadWithLatestActivityId)}>
                <Typography variant="text" element="p">
                  {latestThreadPost} on {formatDate(latestThreadPostDate)}
                </Typography>
              </Link>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-1">
                  <Typography variant="subtext" element="p">
                    by
                  </Typography>
                  <Typography variant="text" element="p">
                    {latestThreadPostBy}
                  </Typography>
                </div>
                <Link to={getURLForThread(threadWithLatestActivityId)}>
                  <Icon type="arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}
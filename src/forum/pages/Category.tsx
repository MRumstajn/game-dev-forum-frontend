import { useEffect, useState } from "react";

import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link, useParams } from "react-router-dom";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { postSearchThreadRequest } from "../../news/api/postSearchThreadRequest";
import { getCategoryById } from "../../Thread/api/getCategoryById";
import { postThreadStatisticsRequest } from "../api/postThreadStatisticsRequest";
import { ThreadStatisticsResponse } from "../api/ThreadStatisticsResponse";
import { ThreadCard } from "../components/ThreadCard";

export function Category() {
  const [threads, setThreads] = useState<ThreadResponse[]>([]);
  const [parentCategory, setParentCategory] = useState<CategoryResponse>();
  const [threadStatistics, setThreadStatistics] = useState<
    ThreadStatisticsResponse[]
  >([]);

  const params = useParams();

  // get parent category
  useEffect(() => {
    getCategoryById(Number(params.categoryId)).then((category) =>
      setParentCategory(category)
    );
  }, [params.categoryId]);

  // get threads
  useEffect(() => {
    if (parentCategory === undefined) {
      return;
    }

    postSearchThreadRequest({
      categoryId: parentCategory.id,
    }).then((matchedThreads) => setThreads(matchedThreads));
  }, [parentCategory]);

  // get details for all threads
  useEffect(() => {
    if (threads.length === 0) {
      return;
    }

    postThreadStatisticsRequest({
      threadIds: threads.map((thread) => thread.id),
    }).then((statistics) => setThreadStatistics(statistics));
  }, [threads]);

  function getStatisticForThread(
    threadId: number
  ): ThreadStatisticsResponse | undefined {
    if (threadId === undefined) {
      return undefined;
    }

    return threadStatistics.find(
      (statistic) => statistic.threadId === threadId
    );
  }

  return (
    <>
      <div className="mt-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>
              <Link to="/forum">Forum</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>
              {parentCategory?.title}
            </Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20 flex flex-col space-y-20">
            <div className="flex flex-row justify-between">
              <Typography variant="h1" element="h1">
                Forum
              </Typography>
              <Button variant="filled" color="primary">
                <span className="text-white">Filter</span>
              </Button>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="grid grid-cols-3">
                <Typography variant="text" element="p">
                  Threads
                </Typography>
                <Typography variant="text" element="p">
                  Posts
                </Typography>
                <Typography variant="text" element="p">
                  Latest post
                </Typography>
              </div>
              <div className="border-b-2" />
              {threads.map((thread) => (
                <ThreadCard
                  threadId={thread.id}
                  title={thread.title}
                  postCount={getStatisticForThread(thread.id)?.postCount}
                  latestPostDate={
                    getStatisticForThread(thread.id)?.latestPost
                      .creationDateTime
                  }
                  latestPostAuthor={
                    getStatisticForThread(thread.id)?.latestPost.author.username
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

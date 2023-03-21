import { useEffect, useState } from "react";

import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

import { ThreadResponse } from "../../common/api/ThreadResponse";
import { postSearchCategoryRequest } from "../../forum/api/postSearchCategoryRequest";
import { postSearchThreadRequest } from "../api/postSearchThreadRequest";
import { NewsCard } from "../components/NewsCard";

export function News() {
  const [newsCategoryId, setNewsCategoryId] = useState<number>();
  const [newsThreads, setNewsThreads] = useState<ThreadResponse[]>();

  useEffect(() => {
    postSearchCategoryRequest({
      title: "News",
    }).then((matches) => {
      setNewsCategoryId(matches[0].id);
    });
  }, []);

  useEffect(() => {
    postSearchThreadRequest({
      categoryId: newsCategoryId,
    }).then((threads) => setNewsThreads(threads));
  }, [newsCategoryId]);

  return (
    <>
      <div className="m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>News</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex flex-col space-y-20">
              <div className="flex flex-row justify-between">
                <Typography variant="h1" element="h1">
                  News
                </Typography>
                <Button variant="filled" color="primary">
                  <span className="text-white">Filter</span>
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {newsThreads &&
                  newsThreads.map((thread: any) => (
                    <NewsCard
                      id={thread.id}
                      title={thread.title}
                      creationDate={thread.creationDate}
                      author={thread.author}
                    />
                  ))}
                {(newsThreads === undefined || newsThreads.length === 0) && (
                  <Typography
                    variant="subtext"
                    element="p"
                    className="text-center"
                  >
                    No threads at the moment
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

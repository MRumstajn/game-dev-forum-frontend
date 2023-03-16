import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link, useParams } from "react-router-dom";

import {
  mockedCategories,
  mockedPosts,
  mockedThreads,
  mockedUsers,
} from "../../mock/mocks";
import { ThreadCard } from "../components/ThreadCard";

export function Category() {
  const params = useParams();

  const mockedCategory = mockedCategories.filter(
    (category) => category.id === Number(params.categoryId)
  )[0];

  function getLatestPost(threadId: number) {
    return mockedPosts
      .filter((post) => post.threadId === threadId)
      .sort((post, postOther) => {
        if (post.creationDate.getTime() < postOther.creationDate.getTime()) {
          return -1;
        } else if (
          post.creationDate.getTime() === postOther.creationDate.getTime()
        ) {
          return 0;
        }
        return 1;
      })[0];
  }

  /*
  *
  *
  * <Card>
                    <Card.Body>
                      <div className="grid grid-cols-4">
                        <Typography variant="text" element="p">
                          {thread.title}
                        </Typography>
                        <Typography variant="text" element="p">
                          {
                            mockedPosts.filter(
                              (post) => post.threadId === thread.id
                            ).length
                          }
                        </Typography>
                        <div className="flex flex-col space-y-1">
                          <Typography variant="text" element="p">
                            {formatDate(getLatestPost(thread.id).creationDate)}
                          </Typography>
                          <div className="flex flex-row space-x-1">
                            <Typography variant="subtext" element="p">
                              by
                            </Typography>
                            <Typography variant="text" element="p">
                              {
                                mockedUsers.filter(
                                  (user) =>
                                    user.id ===
                                    getLatestPost(thread.id).authorId
                                )[0].username
                              }
                            </Typography>
                          </div>
                        </div>

                        <Typography variant="text" element="p">
                          col4
                        </Typography>
                      </div>
                    </Card.Body>
                  </Card>
  *
  * */
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
              {mockedCategory.title}
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
              {mockedThreads
                .filter(
                  (thread) => thread.categoryId === Number(params.categoryId)
                )
                .map((thread) => (
                  <ThreadCard
                    threadId={thread.id}
                    title={thread.title}
                    postCount={
                      mockedPosts.filter((post) => post.threadId === thread.id)
                        .length
                    }
                    latestPostDate={getLatestPost(thread.id).creationDate}
                    latestPostAuthor={
                      mockedUsers.filter(
                        (user) => user.id === getLatestPost(thread.id).authorId
                      )[0].username
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

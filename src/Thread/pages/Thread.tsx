import { FormEvent, useCallback, useEffect, useState } from "react";

import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { DateInput } from "@tiller-ds/date";
import { Input, Textarea } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import { Link, useParams } from "react-router-dom";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { PostResponse } from "../../common/api/PostResponse";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { mockedCurrentUser } from "../../mock/mocks";
import { deletePost } from "../api/deletePost";
import { getCategoryById } from "../api/getCategoryById";
import { getThreadById } from "../api/getThreadById";
import { postCreatePostRequest } from "../api/postCreatePostRequest";
import { postPostSearchRequest } from "../api/postPostSearchRequest";
import { PostCard } from "../components/PostCard";

export function Thread() {
  const params = useParams();

  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostResponse[]>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [inputContent, setInputContent] = useState<string>("");
  const [parentCategory, setParentCategory] = useState<CategoryResponse>();
  const [thread, setThread] = useState<ThreadResponse>();

  const threadId = Number(params.threadId);
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;

  const updatePostList = useCallback(() => {
    postPostSearchRequest({
      threadId: threadId,
    }).then((matches) => {
      setPosts(matches);
    });
  }, [threadId]);

  useEffect(() => {
    updatePostList();
  }, [updatePostList]);

  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId).then((category) =>
        setParentCategory(category)
      );
    }

    if (threadId) {
      getThreadById(threadId).then((th) => setThread(th));
    }
  }, [categoryId, threadId]);

  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updatePostList();
  }

  function postInputFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    postCreatePostRequest({
      threadId: threadId,
      authorId: mockedCurrentUser.id,
      content: inputContent,
    }).then((createdPost) => {
      if (posts !== undefined) {
        setPosts((prevState) => {
          if (prevState) {
            prevState.push(createdPost);
            return prevState;
          }
          return [createdPost];
        });

        updatePostList();
      }
    });
  }

  function cardDeleteHandler(postId: number) {
    deletePost(postId).then(() => updatePostList());
  }

  return (
    <>
      <div className="m-3 sm:m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            {parentCategory ? (
              <div>
                <Breadcrumbs icon={<Icon type="caret-right" />}>
                  <Breadcrumbs.Breadcrumb>
                    <Link to="/forum">Forum</Link>
                  </Breadcrumbs.Breadcrumb>
                  <Breadcrumbs.Breadcrumb>
                    {parentCategory.title}
                  </Breadcrumbs.Breadcrumb>
                </Breadcrumbs>
              </div>
            ) : (
              <Breadcrumbs.Breadcrumb>
                <Link to="/news">News</Link>
              </Breadcrumbs.Breadcrumb>
            )}
            <Breadcrumbs.Breadcrumb>{thread?.title}</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex flex-col space-y-20">
              <div className="flex flex-row justify-between">
                <Typography variant="h1" element="h1">
                  {thread?.title}
                </Typography>
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() => {
                    setFilterFormOpen(!filterFormOpen);
                  }}
                >
                  <span className="text-white">Filter</span>
                </Button>
              </div>
              {filterFormOpen && (
                <Card className="flex flex-col space-y-10">
                  <Card.Body className="bg-gray-200">
                    <form onSubmit={filterFormSubmitHandler}>
                      <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10">
                        <div className="flex flex-row space-x-3 items-center">
                          <Typography variant="text" element="p">
                            By
                          </Typography>
                          <Input name="author" placeholder="Author" />
                        </div>
                        <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row md:space-x-10">
                          <div className="flex flex-row space-x-3 items-center">
                            <Typography variant="text" element="p">
                              Start date
                            </Typography>
                            <DateInput
                              name="startDate"
                              onChange={setStartDate}
                              value={startDate}
                              maxDate={endDate === null ? new Date() : endDate}
                              onReset={() => setStartDate(null)}
                            />
                          </div>
                          <div className="flex flex-row space-x-3 items-center">
                            <Typography variant="text" element="p">
                              End date
                            </Typography>
                            <DateInput
                              name="endDate"
                              onChange={setEndDate}
                              value={endDate}
                              minDate={
                                startDate === null ? new Date() : startDate
                              }
                              onReset={() => setEndDate(null)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end mt-10">
                        <Button
                          variant="filled"
                          color="danger"
                          className="w-full sm:w-fit"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="filled"
                          color="primary"
                          className="w-full sm:w-fit"
                          type="submit"
                        >
                          Apply
                        </Button>
                      </div>
                    </form>
                  </Card.Body>
                </Card>
              )}
              <div className="flex flex-col space-y-10">
                {posts &&
                  posts.map((post) => (
                    <PostCard
                      postId={post.id}
                      content={post.content}
                      author={post.author}
                      creationDate={post.creationDate}
                      likes={post.likes}
                      dislikes={post.dislikes}
                      deleteHandler={() => cardDeleteHandler(post.id)}
                    />
                  ))}
                {(posts === undefined || posts.length === 0) && (
                  <Typography
                    variant="subtext"
                    element="p"
                    className="text-center"
                  >
                    No posts at the moment
                  </Typography>
                )}
              </div>
              <form onSubmit={postInputFormSubmitHandler}>
                <Textarea
                  name="content"
                  value={inputContent}
                  onChange={(event) =>
                    setInputContent(event.currentTarget.value)
                  }
                  placeholder="What would you like to say?"
                />
                <div className="flex flex-row sm:justify-end mt-5">
                  <Button
                    type="submit"
                    variant="filled"
                    color="primary"
                    className="w-full sm:w-fit"
                  >
                    Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

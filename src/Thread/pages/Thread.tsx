import { FormEvent, useState } from "react";

import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { DateInput } from "@tiller-ds/date";
import { Input, Textarea } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import { Link, useParams } from "react-router-dom";

import {
  mockedCurrentUser,
  mockedPosts,
  mockedThreads,
  mockedUsers,
} from "../../mock/mocks";
import { PostCard } from "../components/PostCard";

export function Thread() {
  const params = useParams();

  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  let [posts, setPosts] = useState(
    mockedPosts.filter((post) => post.threadId === Number(params.id))
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [inputContent, setInputContent] = useState<string>("");

  const mockedThread = mockedThreads.filter(
    (thread) => thread.id === Number(params.id)
  )[0];

  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let filtered = mockedPosts;

    const authorFilter = event.currentTarget.author.value;
    if (authorFilter !== undefined) {
      filtered = filtered.filter((post) => {
        const author = mockedUsers.filter(
          (user) => user.id === post.authorId
        )[0];
        return (
          author.username.startsWith(authorFilter) &&
          post.threadId === Number(params.id)
        );
      });
    }

    const startDateRaw = formatDateInputDate(
      event.currentTarget.startDate.value
    );
    const endDateRaw = formatDateInputDate(event.currentTarget.endDate.value);
    if (startDateRaw.length > 0 && endDateRaw.length > 0) {
      filtered = filtered.filter((post) => {
        let startDate = new Date();
        const [startYear, startMonth, startDay] = startDateRaw
          .split("-")
          .map((part) => Number(part));
        startDate.setFullYear(startYear);
        startDate.setMonth(startMonth);
        startDate.setDate(startDay);
        let endDate = new Date();
        const [endYear, endMonth, endDay] = startDateRaw
          .split("-")
          .map((part) => Number(part));
        endDate.setFullYear(endYear);
        endDate.setMonth(endMonth);
        endDate.setDate(endDay);

        return (
          post.threadId === Number(params.id) &&
          post.creationDate.getTime() >= startDate.getTime() &&
          post.creationDate.getTime() <= endDate.getTime()
        );
      });
    }

    setPosts(filtered);
  }

  function formatDateInputDate(date: string): string {
    if (date.length === 0) {
      return "";
    }
    let parts = date.replace(" ", "").split(".");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  function postInputFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newPost = {
      id: mockedPosts.length + 1,
      threadId: Number(params.id),
      content: inputContent,
      authorId: mockedCurrentUser.id,
      creationDate: new Date(),
      likes: 0,
      dislikes: 0,
    };

    mockedPosts.push(newPost);

    setPosts((prevState) => [...prevState, newPost]);
  }

  return (
    <>
      <div className="m-3 sm:m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>
              <Link to="/news">News</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>
              {mockedThread.title}
            </Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex flex-col space-y-20">
              <div className="flex flex-row justify-between">
                <Typography variant="h1" element="h1">
                  {mockedThread.title}
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
                {posts.map((post) => (
                  <PostCard
                    id={post.id}
                    content={post.content}
                    authorId={post.authorId}
                    creationDate={post.creationDate}
                    likes={post.likes}
                    dislikes={post.dislikes}
                    deleteHandler={() =>
                      setPosts((prevState) =>
                        prevState.filter((pst) => pst.id !== post.id)
                      )
                    }
                  />
                ))}
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

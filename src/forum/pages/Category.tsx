import { FormEvent, useCallback, useContext, useEffect, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { DateInput } from "@tiller-ds/date";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import moment from "moment/moment";
import { Link, useParams } from "react-router-dom";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { CreateThreadModal } from "../../common/pages/CreateThreadModal";
import { postSearchThreadRequest } from "../../news/api/postSearchThreadRequest";
import { SearchThreadRequest } from "../../news/api/SearchThreadRequest";
import { getCategoryById } from "../../Thread/api/getCategoryById";
import { postThreadStatisticsRequest } from "../api/postThreadStatisticsRequest";
import { ThreadStatisticsResponse } from "../api/ThreadStatisticsResponse";
import { ThreadCard } from "../components/ThreadCard";

export function Category() {
  const [threads, setThreads] = useState<ThreadResponse[]>([]);
  const [category, setCategory] = useState<CategoryResponse>();
  const [threadStatistics, setThreadStatistics] = useState<
    ThreadStatisticsResponse[]
  >([]);
  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [usernameFilter, setUsernameFilter] = useState<string>();

  const params = useParams();
  const authContext = useContext(AuthContext);
  const newThreadModal = useModal();

  const updateThreadList = useCallback(
    (request: SearchThreadRequest) => {
      if (category === undefined) {
        return;
      }

      postSearchThreadRequest(request).then((matchedThreads) =>
        setThreads(matchedThreads)
      );
    },
    [category]
  );

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

  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let request = {
      categoryId: category?.id,
      authorUsername: usernameFilter,
    } as SearchThreadRequest;

    if (startDate !== null) {
      request.creationDateTimeFromIncluding = moment(startDate)
        .add(1, "day")
        .toDate();
    }
    if (endDate !== null) {
      request.creationDateTimeToIncluding = moment(endDate)
        .add(1, "day")
        .toDate();
    }

    updateThreadList(request);
  }

  // get parent category
  useEffect(() => {
    getCategoryById(Number(params.categoryId)).then((category) => {
      setCategory(category);
    });
  }, [params.categoryId]);

  // get threads
  useEffect(
    () =>
      updateThreadList({
        categoryId: category?.id,
      }),
    [category, updateThreadList]
  );

  // get details for all threads
  useEffect(() => {
    if (threads.length === 0) {
      return;
    }

    postThreadStatisticsRequest({
      threadIds: threads
        .filter((thread) => thread !== null)
        .map((thread) => thread.id),
    }).then((statistics) => setThreadStatistics(statistics));
  }, [threads]);

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
            <Breadcrumbs.Breadcrumb>{category?.title}</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20 flex flex-col space-y-20">
            <div className="flex flex-row justify-between">
              <Typography variant="h1" element="h1">
                {category?.title}
              </Typography>
              <div className="flex flex-row gap-x-3 justify-end">
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() => setFilterFormOpen((prevState) => !prevState)}
                >
                  <span className="text-white">Filter</span>
                </Button>
                {(authContext.loggedInUser?.role === UserRole.USER ||
                  authContext.loggedInUser?.role === UserRole.ADMIN) && (
                  <Button
                    variant="filled"
                    color="primary"
                    onClick={newThreadModal.onOpen}
                  >
                    New thread
                  </Button>
                )}
              </div>
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
                        <Input
                          name="author"
                          placeholder="Author"
                          onChange={(event) =>
                            setUsernameFilter(event.target.value)
                          }
                        />
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
                        onClick={() => setFilterFormOpen(false)}
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
      <CreateThreadModal
        modal={newThreadModal}
        onThreadCreatedCallback={(thread) =>
          setThreads((prevState) => [...prevState, thread])
        }
        categoryId={category?.id}
      />
    </>
  );
}

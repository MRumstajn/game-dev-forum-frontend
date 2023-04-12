import { FormEvent, useContext, useEffect, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import {
  Breadcrumbs,
  Button,
  Card,
  Pagination,
  Typography,
} from "@tiller-ds/core";
import { DateInput } from "@tiller-ds/date";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

import { ThreadResponse } from "../../common/api/ThreadResponse";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { CreateThreadModal } from "../../common/pages/CreateThreadModal";
import { postSearchCategoryRequest } from "../../forum/api/postSearchCategoryRequest";
import { postSearchThreadRequest } from "../api/postSearchThreadRequest";
import { SearchThreadRequest } from "../api/SearchThreadRequest";
import { NewsCard } from "../components/NewsCard";

export function News() {
  const [newsCategoryId, setNewsCategoryId] = useState<number>();
  const [newsThreads, setNewsThreads] = useState<ThreadResponse[]>();
  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [usernameFilter, setUsernameFilter] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [totalThreads, setTotalThreads] = useState<number>();
  const [filterUsed, setFilterUsed] = useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const createThreadModal = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    postSearchCategoryRequest({
      title: "News",
    }).then((response) => {
      if (response.data.content.length > 0) {
        setNewsCategoryId(response.data.content[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (newsCategoryId === undefined) {
      return;
    }

    updateThreadList({
      categoryId: newsCategoryId,
      authorUsername: usernameFilter,
      pageSize: 10,
      pageNumber: page,
    });
    // eslint-disable-next-line
  }, [newsCategoryId, page]);

  function updateThreadList(request: SearchThreadRequest) {
    postSearchThreadRequest(request).then((response) => {
      setNewsThreads(response.data.content);
      setTotalThreads(response.data.totalElements);
    });
  }

  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let request = {
      categoryId: newsCategoryId,
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

    setFilterUsed(true);
  }

  function resetFilter() {
    if (filterUsed) {
      updateThreadList({
        categoryId: newsCategoryId,
        pageNumber: page,
      });

      setFilterUsed(false);
    }

    setFilterFormOpen(false);
  }

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
                <div className="flex flex-row gap-x-3">
                  <Button
                    variant="filled"
                    color="primary"
                    onClick={() => setFilterFormOpen((prevState) => !prevState)}
                  >
                    <span className="text-white">Filter</span>
                  </Button>
                  {authContext.loggedInUser?.role === UserRole.ADMIN && (
                    <Button
                      variant="filled"
                      color="primary"
                      onClick={createThreadModal.onOpen}
                    >
                      <span className="text-white">New thread</span>
                    </Button>
                  )}
                </div>
              </div>
              {filterFormOpen && (
                <Card className="flex flex-col space-y-10">
                  <Card.Body className="bg-gray-200">
                    <form onSubmit={filterFormSubmitHandler}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5">
                        <div>
                          <Input
                            name="author"
                            placeholder="Author"
                            onChange={(event) =>
                              setUsernameFilter(event.target.value)
                            }
                            label="Author"
                          />
                        </div>
                        <div>
                          <DateInput
                            name="startDate"
                            onChange={setStartDate}
                            value={startDate}
                            maxDate={endDate === null ? new Date() : endDate}
                            onReset={() => setStartDate(null)}
                            label="Start date"
                            className="mt-5 sm:mt-0"
                          />
                        </div>
                        <div>
                          <DateInput
                            name="endDate"
                            onChange={setEndDate}
                            value={endDate}
                            minDate={
                              startDate === null ? new Date() : startDate
                            }
                            onReset={() => setEndDate(null)}
                            label="End date"
                            className="mt-5 md:mt-0"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col-reverse space-y-reverse space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end mt-10">
                        <Button
                          variant="filled"
                          color="danger"
                          className="w-full sm:w-fit"
                          onClick={() => resetFilter()}
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

              {newsThreads && newsThreads?.length > 0 && (
                <div className="flex flex-col gap-y-3">
                  {newsThreads &&
                    newsThreads.map((thread: ThreadResponse) => (
                      <NewsCard
                        id={thread.id}
                        title={thread.title}
                        creationDate={thread.creationDateTime}
                        author={thread.author}
                      />
                    ))}
                  {totalThreads && totalThreads > 10 && (
                    <div className="mt-3">
                      <Pagination
                        pageNumber={page ? page : 0}
                        pageSize={10}
                        totalElements={totalThreads ? totalThreads : 0}
                        className="justify-start"
                        onPageChange={setPage}
                      >
                        {() => <></>}
                      </Pagination>
                    </div>
                  )}
                </div>
              )}
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
      <CreateThreadModal
        modal={createThreadModal}
        categoryId={newsCategoryId}
        onThreadCreatedCallback={(thread) => {
          setNewsThreads((prevState) =>
            prevState ? [...prevState, thread] : prevState
          );
          navigate(`/news/${thread.id}`);
        }}
      />
    </>
  );
}

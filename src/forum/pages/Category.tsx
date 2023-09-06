import { FormEvent, useCallback, useContext, useEffect, useState } from "react";

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
import { DropdownMenu } from "@tiller-ds/menu";

import moment from "moment/moment";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { PostResponse } from "../../common/api/PostResponse";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { ConfirmDeleteModal } from "../../common/pages/ConfirmDeleteModal";
import { CreateThreadModal } from "../../common/pages/CreateThreadModal";
import { EditTitleModal } from "../../common/pages/EditTitleModal";
import { postSearchThreadRequest } from "../../news/api/postSearchThreadRequest";
import { SearchThreadRequest } from "../../news/api/SearchThreadRequest";
import { getCategoryById } from "../../Thread/api/getCategoryById";
import { isScreenBelowMdBreakpoint } from "../../util/screenUtil";
import { deleteCategory } from "../api/deleteCategory";
import { putEditCategoryRequest } from "../api/postEditCategoryRequest";
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
  const [page, setPage] = useState<number>(0);
  const [totalThreads, setTotalThreads] = useState<number>();
  const [filterUsed, setFilterUsed] = useState<boolean>(false);
  const [mobileViewMode, setMobileViewMode] = useState<boolean>(false);
  const [filterRequest, setFilterRequest] = useState<SearchThreadRequest>();

  const params = useParams();
  const authContext = useContext(AuthContext);
  const newThreadModal = useModal();
  const navigate = useNavigate();
  const editModal = useModal();
  const confirmDeleteModal = useModal();

  const updateThreadList = useCallback(
    (request: SearchThreadRequest) => {
      if (category === undefined) {
        return;
      }

      postSearchThreadRequest(request).then((response) => {
        setThreads(response.data.content);
        setTotalThreads(response.data.totalElements);
      });
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

  function getLatestPost(threadId: number): PostResponse | undefined {
    const statistics = getStatisticForThread(threadId);

    return statistics ? statistics.latestPost : undefined;
  }

  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPage(0);

    let request = {
      categoryId: category?.id,
      authorUsername: usernameFilter,
    } as SearchThreadRequest;

    if (startDate !== null) {
      request.creationDateTimeFromIncluding = moment(startDate)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .utc(true)
        .toDate();
    }
    if (endDate !== null) {
      request.creationDateTimeToIncluding = moment(endDate)
        .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
        .utc(true)
        .toDate();
    }

    updateThreadList(request);

    setFilterUsed(true);

    setFilterRequest(request);
  }

  function resetFilter() {
    setUsernameFilter(undefined);
    setStartDate(null);
    setEndDate(null);

    if (filterUsed) {
      updateThreadList({
        categoryId: category?.id,
        pageNumber: page,
      });

      setFilterUsed(false);
    }

    setFilterFormOpen(false);

    setFilterRequest({});
  }

  function deleteThisCategory() {
    if (!category) {
      return;
    }

    deleteCategory(category.id).then((response) => {
      if (response.isOk) {
        navigate("/forum");
      }
    });
  }

  function editTitle(newTitle: string) {
    if (!category) {
      return;
    }

    putEditCategoryRequest(category.id, {
      title: newTitle,
    }).then((response) => {
      if (response.isOk) {
        setCategory(response.data);
      }
    });
  }

  // get parent category
  useEffect(() => {
    getCategoryById(Number(params.categoryId)).then((response) => {
      setCategory(response.data);
    });
  }, [params.categoryId]);

  // get threads
  useEffect(() => {
    if (!filterRequest) {
      updateThreadList({
        categoryId: category?.id,
        pageSize: 10,
        pageNumber: page,
      });
    } else {
      updateThreadList({
        ...filterRequest,
        pageNumber: page,
        pageSize: 10,
      });
    }
  }, [category, updateThreadList, page]);

  // get details for all threads
  useEffect(() => {
    if (threads.length === 0) {
      return;
    }

    postThreadStatisticsRequest({
      threadIds: threads
        .filter((thread) => thread !== null)
        .map((thread) => thread.id),
    }).then((response) => setThreadStatistics(response.data));
  }, [threads]);

  const checkScreenSize = useCallback(() => {
    setMobileViewMode(isScreenBelowMdBreakpoint());
  }, []);

  useEffect(() => {
    checkScreenSize();

    window.addEventListener("resize", () => checkScreenSize());

    return window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  return (
    <>
      <div className="m-1 sm:m-10">
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
            <div className="flex flex-col sm:flex-row gap-y-3 justify-between">
              <Typography variant="h1" element="h1">
                {category?.title}
              </Typography>
              <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-y-0 sm:gap-x-3 justify-center mt-5 sm:mt-0 sm:justify-end">
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() =>
                    filterFormOpen ? resetFilter() : setFilterFormOpen(true)
                  }
                >
                  <span className="text-white">Filter</span>
                </Button>
                {(authContext.loggedInUser?.role === UserRole.USER ||
                  authContext.loggedInUser?.role === UserRole.ADMIN) && (
                  <Button
                    variant="filled"
                    color="primary"
                    onClick={newThreadModal.onOpen}
                    className="w-full sm:w-fit"
                  >
                    New thread
                  </Button>
                )}
                {authContext.loggedInUser?.role === UserRole.ADMIN && (
                  <DropdownMenu title="Actions" color="primary">
                    <DropdownMenu.Item onSelect={() => editModal.onOpen(null)}>
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => confirmDeleteModal.onOpen(null)}
                    >
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu>
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
                          label="Creation date from"
                          className="mt-5 sm:mt-0"
                        />
                      </div>
                      <div>
                        <DateInput
                          name="endDate"
                          onChange={setEndDate}
                          value={endDate}
                          minDate={startDate === null ? new Date() : startDate}
                          onReset={() => setEndDate(null)}
                          label="Creation date to"
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
            <div className="flex flex-col space-y-3 pb-10">
              {threads.length > 0 && (
                <div>
                  <div className="grid grid-cols-3 md:grid-cols-4 mb-3">
                    <Typography variant="text" element="p">
                      Threads
                    </Typography>
                    <Typography variant="text" element="p">
                      Author
                    </Typography>
                    <Typography variant="text" element="p">
                      Created on
                    </Typography>
                    {!mobileViewMode && (
                      <Typography variant="text" element="p">
                        Latest post
                      </Typography>
                    )}
                  </div>
                  <div className="border-b-2 mb-3" />
                  <div className="flex flex-col gap-y-3">
                    {threads.map((thread) => (
                      <ThreadCard
                        threadId={thread.id}
                        creationDate={thread.creationDateTime}
                        title={thread.title}
                        author={thread.author}
                        latestPostDate={
                          getLatestPost(thread.id)
                            ? getLatestPost(thread.id)?.creationDateTime
                            : undefined
                        }
                        latestPostAuthor={
                          getLatestPost(thread.id)
                            ? getLatestPost(thread.id)?.author
                            : undefined
                        }
                        showLatestPostLabel={!mobileViewMode}
                      />
                    ))}
                  </div>
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
              {threads.length === 0 && (
                <Typography
                  variant="subtext"
                  element="p"
                  className="text-center mt-10"
                >
                  No threads at the moment
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateThreadModal
        modal={newThreadModal}
        onThreadCreatedCallback={(thread) => {
          setThreads((prevState) => [...prevState, thread]);
          navigate(`/forum/${category?.id}/${thread.id}`);
        }}
        categoryId={category?.id}
      />
      <ConfirmDeleteModal
        modal={confirmDeleteModal}
        confirmCallback={() => deleteThisCategory()}
      />
      <EditTitleModal
        modal={editModal}
        confirmCallback={editTitle}
        oldTitle={category?.title}
      />
    </>
  );
}

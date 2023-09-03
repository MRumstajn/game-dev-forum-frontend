import { FormEvent, useContext, useEffect, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import {
  Breadcrumbs,
  Button,
  Card,
  Pagination,
  Typography,
} from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CategoryStatisticsResponse } from "../../common/api/CategoryStatisticsResponse";
import { postCategoryStatisticsRequest } from "../../common/api/postCategoryStatisticsRequest";
import { SectionResponse } from "../../common/api/SectionResponse";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { CreateCategoryModal } from "../../common/pages/CreateCategoryModal";
import { SearchCategoryRequest } from "../../news/api/SearchCategoryRequest";
import { postSearchCategoryRequest } from "../api/postSearchCategoryRequest";
import { postSearchSectionRequest } from "../api/postSearchSectionRequest";
import { postThreadStatisticsRequest } from "../api/postThreadStatisticsRequest";
import { ThreadStatisticsResponse } from "../api/ThreadStatisticsResponse";
import { ForumCategoryCard } from "../components/ForumCategoryCard";

export function Forum() {
  const [section, setSection] = useState<SectionResponse>();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryStatistics, setCategoryStatistics] = useState<
    CategoryStatisticsResponse[]
  >([]);
  const [threadStatistics, setThreadStatistics] = useState<
    ThreadStatisticsResponse[]
  >([]);
  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  const [titleFilter, setTitleFilter] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>();
  const [filterUsed, setFilterUsed] = useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const newCategoryModal = useModal();

  // get forum section
  useEffect(() => {
    postSearchSectionRequest({
      title: "Forum",
    }).then((response) => setSection(response.data[0]));
  }, []);

  // get categories
  useEffect(() => {
    if (section === undefined) {
      return;
    }

    postSearchCategoryRequest({
      sectionId: section.id,
      pageSize: 10,
      pageNumber: page,
    }).then((response) => {
      setCategories(response.data.content);
      setTotalCategories(response.data.totalElements);
    });
  }, [section, page]);

  // get details about each category
  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    postCategoryStatisticsRequest({
      categoryIds: categories.map((category) => category.id),
    }).then((response) => setCategoryStatistics(response.data));
  }, [categories]);

  // get statistics for latest threads for all categories
  useEffect(() => {
    if (categoryStatistics.length === 0) {
      return;
    }

    if (
      categoryStatistics.filter(
        (statistic) => statistic.threadWithLatestActivity !== null
      ).length > 0
    ) {
      postThreadStatisticsRequest({
        threadIds: categoryStatistics
          .filter((statistic) => statistic.threadWithLatestActivity !== null)
          .map((statistic) => statistic.threadWithLatestActivity.id),
      }).then((response) => setThreadStatistics(response.data));
    }
  }, [categoryStatistics]);

  function getStatisticsForCategory(
    categoryId: number
  ): CategoryStatisticsResponse | undefined {
    return categoryStatistics.find(
      (category) => category.categoryId === categoryId
    );
  }

  function getStatisticsForThread(threadId: number | undefined) {
    if (threadId === undefined) {
      return undefined;
    }

    return threadStatistics.find((thread) => thread.threadId === threadId);
  }

  function getLatestPostInCategory(categoryID: number) {
    const threadWithLatestActivity =
      getStatisticsForCategory(categoryID)?.threadWithLatestActivity;

    if (threadWithLatestActivity) {
      return getStatisticsForThread(threadWithLatestActivity.id)?.latestPost;
    }

    return undefined;
  }

  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (section === undefined) {
      return;
    }

    let request = {
      sectionId: section.id,
      title: titleFilter,
    } as SearchCategoryRequest;

    updateCategoryList(request);

    setFilterUsed(true);
  }

  function updateCategoryList(request: SearchCategoryRequest) {
    postSearchCategoryRequest(request).then((response) =>
      setCategories(response.data.content)
    );
  }

  function resetFilter() {
    setTitleFilter(undefined);

    if (section === undefined) {
      return;
    }

    if (filterUsed) {
      updateCategoryList({
        sectionId: section.id,
        pageNumber: page,
      });

      setFilterUsed(false);
    }

    setFilterFormOpen(false);
  }

  return (
    <>
      <div className="m-1 sm:m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>Forum</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20 flex flex-col space-y-20">
            <div className="flex controls-mobile:flex-col flex-row gap-y-3 justify-between">
              <Typography variant="h1" element="h1">
                Forum
              </Typography>
              <div className="flex controls-mobile:flex-col flex-row gap-y-3 gap-x-3 mt-5 controls-large:mt-0 justify-end">
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() =>
                    filterFormOpen ? resetFilter() : setFilterFormOpen(true)
                  }
                  className="controls-mobile:w-full w-fit"
                >
                  <span className="text-white">Filter</span>
                </Button>
                {authContext.loggedInUser?.role === UserRole.ADMIN && (
                  <Button
                    variant="filled"
                    color="primary"
                    onClick={newCategoryModal.onOpen}
                    className="controls-mobile:w-full w-fit"
                  >
                    <span className="text-white">New category</span>
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
                        <Input
                          name="title"
                          placeholder="Title"
                          onChange={(event) =>
                            setTitleFilter(event.target.value)
                          }
                          label="Title"
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
            {categories.length > 0 && (
              <div>
                <div className="grid grid-cols-3 mb-3">
                  <Typography variant="text" element="p">
                    Category
                  </Typography>
                  <Typography variant="text" element="p">
                    Threads
                  </Typography>
                  <Typography variant="text" element="p">
                    Latest activity
                  </Typography>
                </div>
                <div className="border-b-2 mb-3" />
                <div className="flex flex-col gap-y-3">
                  {categories.map((ct) => (
                    <ForumCategoryCard
                      categoryId={ct.id}
                      title={ct.title}
                      key={ct.id}
                      threadCount={getStatisticsForCategory(ct.id)?.threadCount}
                      threadWithLatestActivity={
                        getStatisticsForCategory(ct.id)
                          ?.threadWithLatestActivity
                      }
                      latestPost={getLatestPostInCategory(ct.id)}
                    />
                  ))}
                  {totalCategories !== undefined && totalCategories > 10 && (
                    <Pagination
                      pageNumber={page ? page : 0}
                      pageSize={10}
                      totalElements={totalCategories ? totalCategories : 0}
                      className="justify-start"
                      onPageChange={setPage}
                    >
                      {() => null}
                    </Pagination>
                  )}
                </div>
              </div>
            )}
            {categories.length === 0 && (
              <Typography variant="subtext" element="p" className="text-center">
                No categories at the moment
              </Typography>
            )}
          </div>
        </div>
      </div>
      <CreateCategoryModal
        modal={newCategoryModal}
        onCreateCategoryCallback={(category) => {
          setCategories((prevState) => [...prevState, category]);
        }}
        sectionId={section?.id}
      />
    </>
  );
}

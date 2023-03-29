import { FormEvent, useEffect, useState } from "react";

import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CategoryStatisticsResponse } from "../../common/api/CategoryStatisticsResponse";
import { postCategoryStatisticsRequest } from "../../common/api/postCategoryStatisticsRequest";
import { SectionResponse } from "../../common/api/SectionResponse";
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

  // get forum section
  useEffect(() => {
    postSearchSectionRequest({
      title: "Forum",
    }).then((matchedSection) => setSection(matchedSection));
  }, []);

  // get categories
  useEffect(() => {
    if (section === undefined) {
      return;
    }

    postSearchCategoryRequest({
      sectionId: section.id,
    }).then((matchedCategories) => setCategories(matchedCategories));
  }, [section]);

  // get details about each category
  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    postCategoryStatisticsRequest({
      categoryIds: categories.map((category) => category.id),
    }).then((statistics) => setCategoryStatistics(statistics));
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
      }).then((statistics) => setThreadStatistics(statistics));
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
  }

  function updateCategoryList(request: SearchCategoryRequest) {
    postSearchCategoryRequest(request).then((matchedCategories) =>
      setCategories(matchedCategories)
    );
  }

  return (
    <>
      <div className="m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>Forum</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20 flex flex-col space-y-20">
            <div className="flex flex-row justify-between">
              <Typography variant="h1" element="h1">
                Forum
              </Typography>
              <Button
                variant="filled"
                color="primary"
                onClick={() => setFilterFormOpen((prevState) => !prevState)}
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
                        <Input
                          name="title"
                          placeholder="Title"
                          onChange={(event) =>
                            setTitleFilter(event.target.value)
                          }
                        />
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
                  Category
                </Typography>
                <Typography variant="text" element="p">
                  Threads
                </Typography>
                <Typography variant="text" element="p">
                  Latest activity
                </Typography>
              </div>
              {categories.map((ct) => (
                <ForumCategoryCard
                  categoryId={ct.id}
                  title={ct.title}
                  key={ct.id}
                  threadCount={getStatisticsForCategory(ct.id)?.threadCount}
                  threadWithLatestActivity={
                    getStatisticsForCategory(ct.id)?.threadWithLatestActivity
                  }
                  latestPost={getLatestPostInCategory(ct.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

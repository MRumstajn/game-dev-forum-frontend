import { useEffect, useState } from "react";

import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CategoryStatisticsResponse } from "../../common/api/CategoryStatisticsResponse";
import { postCategoryStatisticsRequest } from "../../common/api/postCategoryStatisticsRequest";
import { SectionResponse } from "../../common/api/SectionResponse";
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

    postThreadStatisticsRequest({
      threadIds: categoryStatistics.map(
        (statistic) => statistic.threadWithLatestActivity.id
      ),
    }).then((statistics) => setThreadStatistics(statistics));
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
              <Button variant="filled" color="primary">
                <span className="text-white">Filter</span>
              </Button>
            </div>
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
                  threadWithLatestActivityId={
                    getStatisticsForCategory(ct.id)?.threadWithLatestActivity.id
                  }
                  threadWithLatestPostTitle={
                    getStatisticsForCategory(ct.id)?.threadWithLatestActivity
                      .title
                  }
                  latestThreadPostDate={
                    getStatisticsForThread(
                      getStatisticsForCategory(ct.id)?.threadWithLatestActivity
                        .id
                    )?.latestPost.creationDateTime
                  }
                  latestThreadPostAuthorUsername={
                    getStatisticsForThread(
                      getStatisticsForCategory(ct.id)?.threadWithLatestActivity
                        .id
                    )?.latestPost.author.username
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

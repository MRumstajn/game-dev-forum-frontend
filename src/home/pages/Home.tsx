import { useEffect, useState } from "react";

import { Breadcrumbs, Link, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CategoryDetailsStatisticResponse } from "../api/CategoryDetailsStatisticResponse";
import { getOverallStatistics } from "../api/getOverallStatistics";
import { getTopCategories } from "../api/getTopCategories";
import { OverallStatisticsResponse } from "../api/OverallStatisticsResponse";
import { postCategoryDetailsStatisticRequest } from "../api/postCategoryDetailsStatisticRequest";
import { StatisticCard } from "../components/StatisticTable/StatisticTable";

export function Home() {
  const [topCategories, setTopCategories] = useState<CategoryResponse[]>([]);
  const [topCategoriesDetails, setTopCategoriesDetails] = useState<
    CategoryDetailsStatisticResponse[]
  >([]);
  const [overallStatistics, setOverallStatistics] =
    useState<OverallStatisticsResponse>();

  useEffect(() => {
    getTopCategories().then((categories) => {
      setTopCategories(categories);

      postCategoryDetailsStatisticRequest({
        categoryIds: categories.map((category) => category.id),
      }).then((categoriesStatistics) =>
        setTopCategoriesDetails(categoriesStatistics)
      );
    });

    getOverallStatistics().then((statistics) =>
      setOverallStatistics(statistics)
    );
  }, []);

  return (
    <>
      <div className="m-10">
        <div className="container mx-auto">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>Home</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="flex flex-col md:flex-row space-y-20 md:justify-between mt-20">
            <div className="flex flex-col space-y-10 break-word">
              <Typography variant="h1" element="h1">
                Welcome
              </Typography>
              <div className="flex flex-col space-y-3 w-2/3">
                <Typography variant="text" element="p">
                  Welcome to the Game Developer Forum!
                </Typography>
                <Typography variant="text" element="p">
                  This is the go to place if you want to ask questions about
                  anything related to game development or share your ideas with
                  other developers
                </Typography>
                <Typography variant="text" element="p">
                  These links might be helpful to you if you’re new here:
                </Typography>
                <ul className="list-disc pl-10">
                  <li>
                    <Link to="/rules">Rules</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <Link to="/tos">Terms of service</Link>
                  </li>
                  <li>
                    <Link to="/privacy">Privacy policy</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col space-y-10 w-full md:w-1/3">
              <StatisticCard
                statisticName="Popular topics"
                statistics={topCategories.map((category) => {
                  return {
                    name: category.title,
                    value:
                      topCategoriesDetails.length > 0
                        ? `${
                            topCategoriesDetails.filter(
                              (details) => details.categoryId === category.id
                            )[0].threadCount
                          } threads`
                        : `0 threads`,
                  };
                })}
              />
              <StatisticCard
                statisticName="Forum stats"
                statistics={[
                  {
                    name: "Total categories",
                    value: overallStatistics?.categoryCount
                      ? overallStatistics.categoryCount.toString()
                      : "0",
                  },
                  {
                    name: "Total threads",
                    value: overallStatistics?.threadCount
                      ? overallStatistics.threadCount.toString()
                      : "0",
                  },
                  {
                    name: "Total posts",
                    value: overallStatistics?.postCount
                      ? overallStatistics.postCount.toString()
                      : "0",
                  },
                  {
                    name: "Total users",
                    value: overallStatistics?.userCount
                      ? overallStatistics.userCount.toString()
                      : "0",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

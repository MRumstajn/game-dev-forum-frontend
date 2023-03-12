import { Statistic } from "../home/components/StatisticTable/StatisticTable";

export const mockedHomepageTopicStatistics = [
  {
    name: "topic_1",
    value: "10 threads",
  },
  {
    name: "topic_2",
    value: "12 threads",
  },
  {
    name: "topic_3",
    value: "15 threads",
  },
] as Statistic[];

export const mockedHomepageOverallStatistics = [
  {
    name: "Total categories",
    value: "80",
  },
  {
    name: "Total threads",
    value: "1300",
  },
  {
    name: "Total users",
    value: "20",
  },
] as Statistic[];

export const mockedNews = [
  {
    id: 1,
    title: "What's new in v2",
    author: "Admin",
    creationDate: new Date(),
    content: "Hello world",
  },
  {
    id: 2,
    title: "Happy new year",
    author: "Admin",
    creationDate: new Date(),
    content: "Hello world",
  },
  {
    id: 3,
    title: "Recent changes",
    author: "Admin",
    creationDate: new Date(),
    content: "Hello world",
  },
];

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

export const mockedThreads = [
  {
    id: 1,
    sectionId: 1,
    title: "Hello world",
    authorId: 1,
    creationDate: new Date(),
  },
  {
    id: 2,
    sectionId: 1,
    title: "Happy new year",
    authorId: 1,
    creationDate: new Date(),
  },
  {
    id: 3,
    sectionId: 1,
    title: "What's new in v2",
    authorId: 1,
    creationDate: new Date(),
  },
];

export const mockedPosts = [
  {
    id: 1,
    authorId: 1,
    threadId: 1,
    content: "Hello world",
    creationDate: new Date(),
    likes: 10,
    dislikes: 3,
  },
  {
    id: 2,
    authorId: 1,
    threadId: 2,
    content: "Happy 2023!",
    creationDate: new Date(),
    likes: 10,
    dislikes: 3,
  },
  {
    id: 4,
    authorId: 1,
    threadId: 3,
    content: "Changelog: added bio section!",
    creationDate: new Date(),
    likes: 10,
    dislikes: 3,
  },
  {
    id: 5,
    authorId: 2,
    threadId: 3,
    content: "Awesome!",
    creationDate: new Date(),
    likes: 10,
    dislikes: 3,
  },
  {
    id: 6,
    authorId: 3,
    threadId: 3,
    content: "Interesting idea",
    creationDate: new Date(),
    likes: 10,
    dislikes: 3,
  },
];

export const mockedUsers = [
  {
    id: 1,
    username: "Admin",
    joinDate: new Date(),
    bio: "Bio: gamer, developer",
  },
  {
    id: 2,
    username: "Jack",
    joinDate: new Date(),
    bio: "Bio: graphics designer",
  },
  {
    id: 3,
    username: "Haisley",
    joinDate: new Date(),
    bio: "Bio: graphics designer",
  },
];

export const mockedCurrentUser = mockedUsers[0];

import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

import { mockedCategories, mockedThreads, mockedUsers } from "../../mock/mocks";
import { ForumCategoryCard } from "../components/ForumCategoryCard";

export function Forum() {
  function getThreadWithLatestActivity(categoryId: number) {
    return mockedThreads
      .filter((thread) => thread.categoryId === categoryId)
      .sort((thread, threadOther) => {
        if (
          thread.creationDate.getTime() < threadOther.creationDate.getTime()
        ) {
          return -1;
        } else if (
          thread.creationDate.getTime() === threadOther.creationDate.getTime()
        ) {
          return 0;
        }
        return 1;
      })[0];
  }

  console.log(getThreadWithLatestActivity(2));
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
              {mockedCategories
                .filter((ct: any) => ct.sectionId === 2)
                .map((ct: any) => (
                  <ForumCategoryCard
                    categoryId={ct.id}
                    title={ct.title}
                    threadCount={
                      mockedThreads.filter(
                        (thread) => thread.categoryId === ct.id
                      ).length
                    }
                    latestThreadPost={getThreadWithLatestActivity(ct.id).title}
                    latestThreadPostBy={
                      mockedUsers.filter(
                        (user) =>
                          user.id ===
                          getThreadWithLatestActivity(ct.id).authorId
                      )[0].username
                    }
                    latestThreadPostDate={
                      getThreadWithLatestActivity(ct.id).creationDate
                    }
                    threadWithLatestActivityId={
                      getThreadWithLatestActivity(ct.id).id
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

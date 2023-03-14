import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

import { mockedThreads, mockedUsers } from "../../mock/mocks";
import { NewsCard } from "../components/NewsCard";

export function News() {
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
                <Button variant="filled" color="primary">
                  <span className="text-white">Filter</span>
                </Button>
              </div>
              <div className="flex flex-col space-y-3">
                {mockedThreads
                  .filter((th: any) => th.sectionId === 1)
                  .map((card: any) => (
                    <NewsCard
                      id={card.id}
                      title={card.title}
                      creationDate={card.creationDate}
                      author={
                        mockedUsers.filter((usr) => usr.id === card.authorId)[0]
                          .username
                      }
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { Breadcrumbs, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

export function About() {
  return (
    <>
      <div className="m-1 sm:m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>Rules</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <Typography variant="h1" element="h1" className="text-center">
              About
            </Typography>
            <div className="flex flex-col items-center space-y-20 mt-20">
              <div className="flex flex-col space-y-3">
                <Typography variant="title" element="h5">
                  {" "}
                  What is the Game Developer Forum?
                </Typography>
                <Typography variant="text" element="p">
                  The Game Developer Forum is a platform for game developers,
                  designers and game content creators in general to come
                  together, talk, and share ideas or projects.
                </Typography>
              </div>
              <div className="flex flex-col space-y-3">
                <Typography variant="title" element="h5">
                  Technologies used
                </Typography>
                <Typography variant="text" element="p">
                  The first iteration of the platform was written in Python
                  using the Flask framework for the backend, MongoDB database
                  for storage, and classic HTML, Javascript, and CSS combined
                  with Flask's Jinja2 templating engine. The rewrite version is
                  written in Java using Spring boot for the backend, PostgreSQL
                  for the database, and ReactJS for the frontend.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

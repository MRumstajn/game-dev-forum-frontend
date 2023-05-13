import { Breadcrumbs, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

export function Rules() {
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
              Rules
            </Typography>
            <div className="flex flex-col items-center space-y-20 sm:flex-row sm:justify-center sm:space-x-20 sm:space-y-0 mt-20">
              <div>
                <Typography variant="title" element="h3">
                  Things to do
                </Typography>
                <ul>
                  <li>✔ Be police and respectful</li>
                  <li>✔ Stay on topic</li>
                </ul>
              </div>
              <div>
                <Typography variant="title" element="h3">
                  Things not avoid doing
                </Typography>
                <ul>
                  <li>❌ Use profanity</li>
                  <li>❌ Post inappropriate content</li>
                  <li>❌ Insult or provoke others</li>
                  <li>❌ Spam or bump threads</li>
                  <li>❌ Advertise</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

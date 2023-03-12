import React from "react";

import { ButtonGroups, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { IntlProvider } from "@tiller-ds/intl";
import { TopNavigation } from "@tiller-ds/menu";

import { Link } from "react-router-dom";

import Button = ButtonGroups.Button;

export function Navbar() {
  return (
    <>
      <TopNavigation
        logo={
          <Link to="/home">
            <Typography variant="h4" element="h4">
              <h4 className="text-white">GameDevForum</h4>
            </Typography>
          </Link>
        }
        topRightAction={
          <div className="flex flex-row space-x-3">
            <TopNavigation.Dropdown
              title="search"
              buttonVariant="text"
              icon={<Icon type="magnifying-glass" className="" />}
              menuType="icon"
              iconColor="default"
            >
              <IntlProvider lang="hr">
                <Input name="search" placeholder="🔎 Search..." />
              </IntlProvider>
              <Button variant="filled" className="w-full">
                Search
              </Button>
            </TopNavigation.Dropdown>
            <Button variant="filled" color="primary">
              Login
            </Button>
          </div>
        }
      >
        <TopNavigation.Navigation>
          <TopNavigation.Navigation.Item to="/news">
            News
          </TopNavigation.Navigation.Item>
          <TopNavigation.Navigation.Item to="/forum">
            Forum
          </TopNavigation.Navigation.Item>
          <TopNavigation.Navigation.Item to="/rules">
            Rules
          </TopNavigation.Navigation.Item>
          <TopNavigation.Navigation.Item to="/about">
            About
          </TopNavigation.Navigation.Item>
          <TopNavigation.Navigation.Item to="/chat">
            Chat
          </TopNavigation.Navigation.Item>
        </TopNavigation.Navigation>
      </TopNavigation>
    </>
  );
}

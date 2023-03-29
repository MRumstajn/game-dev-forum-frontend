import React, { useContext } from "react";

import { Button, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu, TopNavigation } from "@tiller-ds/menu";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../common/components/AuthProvider";
import { clearToken } from "../util/jwtTokenUtils";

export function Navbar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  function logOut() {
    authContext.setLoggedInUser(undefined);
    clearToken();
    navigate("/login");
  }

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
              <Input name="search" placeholder="🔎 Search..." />
              <Button variant="filled" className="w-full">
                Search
              </Button>
            </TopNavigation.Dropdown>
            {authContext.loggedInUser ? (
              <DropdownMenu
                title={
                  <Typography variant="text" element="p">
                    <p className="text-white">
                      {authContext.loggedInUser.username}
                    </p>
                  </Typography>
                }
                iconPlacement="leading"
                openExpanderIcon={<Icon type="user" variant="light" />}
                iconColor="light"
              >
                <DropdownMenu.Item onSelect={() => {}}>
                  View profile
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => logOut()}>
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu>
            ) : (
              <Button
                variant="filled"
                color="primary"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
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

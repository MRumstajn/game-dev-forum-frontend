import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button, IconButton, Typography } from "@tiller-ds/core";
import { Input } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";

import { Link, useNavigate } from "react-router-dom";

import { NotificationPopup } from "./NotificationPopup";
import { AuthContext } from "../../common/components/AuthProvider";
import { clearToken } from "../../util/jwtTokenUtils";
import { isScreenBelowNavbarBreakpoint } from "../../util/screenUtil";
import { NotificationResponse } from "../api/NotificationResponse";
import { postMarkNotificationAsReadRequest } from "../api/postMarkNotificationAsReadRequest";
import { postSearchNotificationRequest } from "../api/postSearchNotificationRequest";

const navLinks: { [key: string]: string } = {
  News: "/news",
  Forum: "/forum",
  Rules: "/rules",
  About: "/about",
  Chat: "/chat",
};

export function Navbar() {
  const [selectedNavLink, setSelectedNavLink] = useState<string>();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [notificationsShown, setNotificationsShown] = useState<boolean>(false);
  const [mobileNotifications, setMobileNotifications] =
    useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const [notificationPage, setNotificationPage] = useState<number>(0);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);

  const popupRef = useRef<any>(null);
  const notificationBellRef = useRef<any>(null);
  const navbarRef = useRef<any>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  function logOut() {
    authContext.setLoggedInUser(undefined);
    clearToken();
    navigate("/login");
  }

  useEffect(() => {
    if (!authContext.loggedInUser) {
      return;
    }

    postSearchNotificationRequest({
      recipientId: authContext.loggedInUser.id,
      pageNumber: notificationPage,
      pageSize: 3,
    }).then((response) => {
      setNotifications(() => response.data.content);
      setTotalNotifications(response.data.totalElements);
    });
  }, [authContext.loggedInUser, notificationPage]);

  useEffect(() => {
    function handleMouseClick(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !notificationBellRef.current.contains(event.target)
      ) {
        setNotificationsShown(false);
      }

      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }

    window.addEventListener("mousedown", handleMouseClick);

    // cleanup
    return () => window.removeEventListener("mousedown", handleMouseClick);
  }, []);

  function markNotificationsAsRead(notificationIds: number[]) {
    postMarkNotificationAsReadRequest({
      notificationIds: notificationIds,
    }).then(() => {
      setNotifications((prevState) => {
        notificationIds.forEach((notificationId) => {
          const notificationIndex = prevState.findIndex(
            (notification) => notification.id === notificationId
          );

          if (notificationIndex !== -1) {
            prevState[notificationIndex].isRead = true;
          }
        });

        return [...prevState];
      });
    });
  }

  function markAllNotificationsAsRead() {
    markNotificationsAsRead(
      notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification.id)
    );
  }

  function unreadNotificationsExist() {
    return (
      notifications.find((notification) => !notification.isRead) !== undefined
    );
  }

  const checkScreenSize = useCallback(() => {
    if (isScreenBelowNavbarBreakpoint() && !mobileNotifications) {
      setMobileNotifications(true);
    } else if (mobileNotifications && !isScreenBelowNavbarBreakpoint()) {
      setMobileNotifications(false);
    }
  }, [mobileNotifications]);

  useEffect(() => {
    checkScreenSize();

    window.addEventListener("resize", () => checkScreenSize());

    return window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  useEffect(() => {
    const locationParts = window.location.pathname.split("/");
    const location = locationParts.length >= 2 ? "/" + locationParts[1] : "/";

    if (!Object.values(navLinks).includes(location)) {
      setSelectedNavLink(undefined);
    }
  }, [window.location.pathname]);

  return (
    <>
      <nav
        className={`flex flex-col ${
          expanded ? "gap-y-10 justify-center" : ""
        }  nav-break:flex-row nav-break:gap-y-0 nav-break:justify-between nav-break:items-start bg-blue-600 p-3 text-white`}
        ref={navbarRef}
      >
        <div className="flex flex-col nav-break:flex-row justify-center nav-break:justify-start nav-break:gap-x-10">
          <div className="flex flex-row justify-between">
            <Link to="/home">
              <Typography variant="h4" element="h4">
                <h4 className="text-white">GameDevForum</h4>
              </Typography>
            </Link>
            {isScreenBelowNavbarBreakpoint() && (
              <IconButton
                icon={<Icon type={expanded ? "x" : "list"} />}
                onClick={() => setExpanded((prevState) => !prevState)}
              />
            )}
          </div>

          <ul
            className={`${
              isScreenBelowNavbarBreakpoint() && !expanded ? "hidden" : "block"
            } list-none flex flex-col gap-y-5 items-center mt-5 nav-break:mt-0 
            nav-break:flex-row nav-break:gap-x-7 nav-break:ml-10 nav-break:gap-y-0`}
          >
            {Object.keys(navLinks).map((link) => (
              <li
                className={selectedNavLink === link ? "border-b" : ""}
                onClick={() => setSelectedNavLink(link)}
              >
                <Link to={navLinks[link]}>{link}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-5 items-center nav-break:flex-row nav-break:gap-x-5 nav-break:gap-y-0">
          <div
            className={`${
              isScreenBelowNavbarBreakpoint() && !expanded
                ? "hidden"
                : "block w-1/2"
            }`}
          >
            <Input name="search" placeholder="🔎 Search" />
          </div>
          <div className={"flex gap-x-3 justify-center nav-break:justify-end"}>
            <div className="relative">
              {authContext.loggedInUser &&
                (expanded || !isScreenBelowNavbarBreakpoint()) && (
                  <div ref={notificationBellRef}>
                    <IconButton
                      className="items-center text-center translate-y-1/4 my-auto"
                      icon={
                        <Icon
                          type={
                            unreadNotificationsExist()
                              ? "bell-ringing"
                              : "bell-simple"
                          }
                        />
                      }
                      onClick={() =>
                        setNotificationsShown((prevState) => !prevState)
                      }
                      label="Notifications"
                    />
                  </div>
                )}
              {!isScreenBelowNavbarBreakpoint() &&
                !mobileNotifications &&
                notificationsShown && (
                  <div
                    className="absolute right-0 origin-top-right z-10"
                    ref={popupRef}
                  >
                    <NotificationPopup
                      markAllNotificationsAsReadCallback={
                        markAllNotificationsAsRead
                      }
                      markNotificationsAsReadCallback={markNotificationsAsRead}
                      notifications={notifications}
                      changePageCallback={setNotificationPage}
                      totalNotifications={totalNotifications}
                    />
                  </div>
                )}
            </div>
            <div
              className={`${
                isScreenBelowNavbarBreakpoint() && !expanded
                  ? "hidden"
                  : "block"
              }`}
            >
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
                  className="w-full nav-break:w-fit"
                >
                  <DropdownMenu.Item
                    onSelect={() =>
                      navigate(`/profile/${authContext.loggedInUser?.id}`)
                    }
                  >
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
          </div>
          {isScreenBelowNavbarBreakpoint() &&
            mobileNotifications &&
            notificationsShown && (
              <div className="relative w-full z-10" ref={popupRef}>
                <NotificationPopup
                  markAllNotificationsAsReadCallback={
                    markAllNotificationsAsRead
                  }
                  markNotificationsAsReadCallback={markNotificationsAsRead}
                  notifications={notifications}
                  changePageCallback={setNotificationPage}
                  totalNotifications={totalNotifications}
                />
              </div>
            )}
        </div>
      </nav>
    </>
  );
}

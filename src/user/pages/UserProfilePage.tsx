import { useCallback, useContext, useEffect, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import Avatar from "react-avatar";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ChangePasswordModal } from "./changePasswordModal";
import { UserResponse } from "../../common/api/UserResponse";
import { AuthContext } from "../../common/components/AuthProvider";
import { followUser } from "../api/followUser";
import { getFollowers } from "../api/getFollowers";
import { getIsFollowing } from "../api/getIsFollowing";
import { getUserById } from "../api/getUserById";
import { unfollowUser } from "../api/unfollowUser";

export function UserProfilePage() {
  const [user, setUser] = useState<UserResponse>();
  const [isCurrentUserFollowingUser, setIsCurrentUsrFollowingUser] =
    useState<boolean>(false);
  const [followers, setFollowers] = useState<UserResponse[]>([]);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const changePasswordModal = useModal();
  const params = useParams();

  const isCurrentUserProfile = authContext.loggedInUser?.id === user?.id;

  function followHandler() {
    if (user) {
      followUser(user.id).then((response) => {
        if (response.isOk) {
          setIsCurrentUsrFollowingUser(true);
          setFollowers((prevState) =>
            authContext.loggedInUser
              ? [...prevState, authContext.loggedInUser]
              : prevState
          );
        }
      });
    }
  }

  function unfollowHandler() {
    if (user) {
      unfollowUser(user.id).then((response) => {
        if (response.ok) {
          setIsCurrentUsrFollowingUser(false);
          setFollowers((prevState) =>
            prevState.filter(
              (follower) => follower.id !== authContext.loggedInUser?.id
            )
          );
        }
      });
    }
  }

  const updateFollowerList = useCallback(() => {
    if (user) {
      getFollowers(user.id).then((response) => setFollowers(response.data));
    }
  }, [user]);

  useEffect(() => {
    if (params.id) {
      getUserById(Number(params.id)).then((response) => setUser(response.data));
    }
  }, [params]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (authContext.loggedInUser) {
      getIsFollowing(user.id).then((response) =>
        setIsCurrentUsrFollowingUser(response.data.isFollowing)
      );

      updateFollowerList();
    }
  }, [authContext.loggedInUser, updateFollowerList, user]);

  return (
    <>
      <div className="m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>
              {user?.username}'s profile
            </Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20 flex flex-col gap-y-20">
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-row justify-between">
                <Typography variant="h3" element="h3">
                  User information
                </Typography>
                <div className="flex flex-row gap-x-3">
                  {authContext.loggedInUser?.id === user?.id && (
                    <div className="flex flex-row gap-x-3">
                      <Button
                        variant="filled"
                        color="primary"
                        onClick={() => navigate("/profile/edit")}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="filled"
                        color="primary"
                        onClick={changePasswordModal.onOpen}
                      >
                        Change password
                      </Button>
                    </div>
                  )}
                  {authContext.loggedInUser &&
                    !isCurrentUserProfile &&
                    !isCurrentUserFollowingUser && (
                      <div className="flex flex-row gap-x-3">
                        <Button
                          variant="filled"
                          color="primary"
                          onClick={() => followHandler()}
                        >
                          Follow
                        </Button>
                      </div>
                    )}
                  {authContext.loggedInUser &&
                    !isCurrentUserProfile &&
                    isCurrentUserFollowingUser && (
                      <div className="flex flex-row gap-x-3">
                        <Button
                          variant="filled"
                          color="primary"
                          onClick={() => unfollowHandler()}
                        >
                          Unfollow
                        </Button>
                      </div>
                    )}
                  {authContext.loggedInUser?.id !== user?.id && (
                    <Button
                      variant="filled"
                      color="primary"
                      leadingIcon={<Icon type="envelope" />}
                      onClick={() => navigate(`/messaging/new/${user?.id}`)}
                    >
                      Message
                    </Button>
                  )}
                </div>
              </div>
              <Card>
                <Card.Body>
                  <div className="flex flex-col space-y-5">
                    <div className="flex flex-row gap-x-3 w-full items-center">
                      <Avatar name={user?.username} size="50" round={true} />
                      <Typography variant="title" element="h4">
                        <strong>{user?.username}</strong>
                      </Typography>
                    </div>
                    <div className="grid grid-cols-3">
                      <div>
                        <Typography variant="title" element="h4">
                          Join date:
                        </Typography>
                        <Typography variant="text" element="p">
                          {user?.joinDate.toString()}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="title" element="h4">
                          Forum role:
                        </Typography>
                        <Typography variant="text" element="p">
                          {user?.role}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="title" element="h4">
                          Bio:
                        </Typography>
                        <Typography variant="text" element="p">
                          {user?.bio}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="flex flex-col gap-y-5">
              <Typography variant="h3" element="h3">
                {followers.length > 0
                  ? `Followers (${followers.length})`
                  : "Followers"}
              </Typography>
              <Card>
                <Card.Body>
                  <div className="flex flex-row flex-wrap gap-x-5 gap-y-3 justify-start items-center">
                    {followers.map((follower) => (
                      <div className="flex flex-col gap-x-1 items-center">
                        <Avatar
                          name={follower.username}
                          size="50"
                          round={true}
                        />
                        <Typography variant="text" element="p">
                          <strong>{follower.username}</strong>
                        </Typography>
                      </div>
                    ))}
                    {followers.length === 0 && (
                      <Typography
                        variant="subtext"
                        element="p"
                        className="text-center"
                      >
                        No followers yet
                      </Typography>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal modal={changePasswordModal} />
    </>
  );
}

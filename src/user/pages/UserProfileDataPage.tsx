import { useContext } from "react";

import { useModal } from "@tiller-ds/alert";
import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import Avatar from "react-avatar";
import { Link, useNavigate } from "react-router-dom";

import { ChangePasswordModal } from "./changePasswordModal";
import { AuthContext } from "../../common/components/AuthProvider";

export function UserProfileDataPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const changePasswordModal = useModal();

  return (
    <>
      <div className="m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>
              {authContext.loggedInUser?.username}'s profile
            </Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex flex-col space-y-20">
              <div className="flex flex-row justify-between">
                <Typography variant="h3" element="h3">
                  User information
                </Typography>
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
              </div>
              <Card>
                <Card.Body>
                  <div className="flex flex-col space-y-5">
                    <div className="flex flex-row gap-x-3 w-full items-center">
                      <Avatar
                        name={authContext.loggedInUser?.username}
                        size="50"
                        round={true}
                      />
                      <Typography variant="title" element="h4">
                        <strong>{authContext.loggedInUser?.username}</strong>
                      </Typography>
                    </div>
                    <div className="grid grid-cols-3">
                      <div>
                        <Typography variant="title" element="h4">
                          Join date:
                        </Typography>
                        <Typography variant="text" element="p">
                          {authContext.loggedInUser?.joinDate.toString()}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="title" element="h4">
                          Forum role:
                        </Typography>
                        <Typography variant="text" element="p">
                          {authContext.loggedInUser?.role}
                        </Typography>
                      </div>
                    </div>
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

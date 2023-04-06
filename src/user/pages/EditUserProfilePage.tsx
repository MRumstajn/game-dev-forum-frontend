import { useContext } from "react";

import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { InputField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { AuthContext } from "../../common/components/AuthProvider";
import { INPUT_TOO_SHORT_MESSAGE } from "../../common/constants";
import { saveToken } from "../../util/jwtTokenUtils";
import { putEditUserRequest } from "../api/putEditUserRequest";

type Form = {
  username: string;
};

const initialFormValues = {
  username: "",
};

const validationSchema = yup.object().shape({
  username: yup.string().min(3, INPUT_TOO_SHORT_MESSAGE).nullable(),
});

export function EditUserProfilePage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  function formSubmitHandler(form: Form) {
    if (!authContext.loggedInUser) {
      return;
    }

    putEditUserRequest(authContext.loggedInUser.id, {
      username: form.username,
    }).then((response) => {
      authContext.setLoggedInUser(response.user);
      saveToken(response.newAccessToken);
      navigateBack();
    });
  }

  function navigateBack() {
    navigate("/profile");
  }

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
            <Formik
              initialValues={initialFormValues}
              onSubmit={formSubmitHandler}
              validationSchema={validationSchema}
            >
              {(formik) => (
                <div className="flex flex-col gap-y-5">
                  <Typography variant="h3" element="h3">
                    Edit user information
                  </Typography>
                  <Card>
                    <Card.Body>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col gap-y-3">
                          <div className="flex flex-row gap-x-3 items-center">
                            <Typography variant="text" element="p">
                              Change username:
                            </Typography>
                            <InputField
                              name="username"
                              defaultValue={authContext.loggedInUser?.username}
                            />
                          </div>
                          <div className="flex flex-row gap-x-3 justify-end">
                            <Button
                              variant="filled"
                              color="danger"
                              type="reset"
                              onClick={() => navigateBack()}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="filled"
                              color="primary"
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

import { useContext, useEffect, useState } from "react";

import { Breadcrumbs, Button, Card, Typography } from "@tiller-ds/core";
import { InputField, TextareaField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { ErrorCode } from "../../common/api/ErrorCode";
import { AuthContext } from "../../common/components/AuthProvider";
import {
  BIO_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
} from "../../common/constants";
import { saveToken } from "../../util/jwtTokenUtils";
import { putEditUserRequest } from "../api/putEditUserRequest";

type Form = {
  username: string;
  bio: string;
};

const initialFormValues = {
  username: "",
  bio: "",
};

const validationSchema = yup.object().shape({
  username: yup.string().min(3, INPUT_TOO_SHORT_MESSAGE).nullable(),
  bio: yup.string().max(100, BIO_TOO_LONG_MESSAGE).nullable(),
});

export function EditUserProfilePage() {
  const [initialValuesState, setInitialValuesState] =
    useState<Form>(initialFormValues);
  const [reInitFormik, setReInitFormik] = useState<boolean>(false);
  const [showUsernameTakenError, setShowUsernameTakenError] =
    useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  function formSubmitHandler(form: Form) {
    if (!authContext.loggedInUser) {
      return;
    }

    if (
      form.username !== authContext.loggedInUser.username ||
      form.bio !== authContext.loggedInUser.bio
    ) {
      putEditUserRequest(authContext.loggedInUser.id, {
        username: form.username
          ? form.username !== authContext.loggedInUser.username
            ? form.username
            : undefined
          : undefined,
        bio: form.bio
          ? form.bio !== authContext.loggedInUser.bio
            ? form.bio
            : undefined
          : undefined,
      }).then((response) => {
        if (response.errorCode !== ErrorCode.DUPLICATE_RESOURCE) {
          authContext.setLoggedInUser(response.data.user);
          saveToken(response.data.newAccessToken);
          navigateBack();
        } else {
          setShowUsernameTakenError(true);
        }
      });
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => setShowUsernameTakenError(false), 3000);

    // cleanup
    return () => {
      clearTimeout(timeout);
    };
  }, [showUsernameTakenError]);

  function navigateBack() {
    navigate(`/profile/${authContext.loggedInUser?.id}`);
  }

  useEffect(() => {
    setInitialValuesState((prevState) => {
      return {
        ...prevState,
        username: authContext.loggedInUser
          ? authContext.loggedInUser.username
          : initialFormValues.username,
        bio: authContext.loggedInUser
          ? authContext.loggedInUser.bio
          : initialFormValues.bio,
      };
    });
    setReInitFormik(true);
  }, [authContext.loggedInUser]);

  return (
    <>
      <div className="m-1 sm:m-10">
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
              enableReinitialize={reInitFormik}
              initialValues={initialValuesState}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:w-fit gap-y-3">
                          <div>
                            <Typography variant="text" element="p">
                              Change username:
                            </Typography>
                          </div>
                          <div className="flex flex-row justify-start">
                            <InputField
                              name="username"
                              className="w-full sm:w-fit"
                            />
                          </div>
                          <div>
                            <Typography variant="text" element="p">
                              Change bio:
                            </Typography>
                          </div>
                          <div className="flex flex-row justify-start">
                            <TextareaField
                              name="bio"
                              width={100}
                              height={20}
                              className="w-full sm:w-fit"
                            />
                          </div>

                          {showUsernameTakenError && (
                            <div className="col-span-2 bg-red-600 p-3 rounded-md my-3">
                              <Typography variant="text" element="h4">
                                <div className="flex flex-row space-x-3">
                                  <Icon
                                    type="x-circle"
                                    className="text-white"
                                  />
                                  <p className="text-white">
                                    Username is already taken
                                  </p>
                                </div>
                              </Typography>
                            </div>
                          )}
                        </div>

                        <div className="flex controls-mobile:flex-col-reverse flex-row gap-x-3 gap-y-3 justify-end mt-5">
                          <Button
                            variant="filled"
                            color="danger"
                            type="reset"
                            onClick={() => navigateBack()}
                            className="controls-mobile:w-full w-fit"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="filled"
                            color="primary"
                            type="submit"
                            className="controls-mobile:w-full w-fit"
                          >
                            Save changes
                          </Button>
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

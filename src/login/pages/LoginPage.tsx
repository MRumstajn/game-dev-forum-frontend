import { useContext, useState } from "react";

import { Button, Typography } from "@tiller-ds/core";
import { InputField, PasswordInputField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { ErrorCode } from "../../common/api/ErrorCode";
import { UserResponse } from "../../common/api/UserResponse";
import { AuthContext } from "../../common/components/AuthProvider";
import {
  INPUT_TOO_LONG_MESSAGE,
  LOGIN_FIELD_MAX_LEN,
} from "../../common/constants";
import { saveToken } from "../../util/jwtTokenUtils";
import { postLoginRequest } from "../api/postLoginRequest";

type LoginForm = {
  username: string;

  password: string;
};

const initialFormValues = {
  username: "",

  password: "",
} as LoginForm;

const formValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .max(
      LOGIN_FIELD_MAX_LEN,
      `${INPUT_TOO_LONG_MESSAGE}, max length is ${LOGIN_FIELD_MAX_LEN}.`
    ),
  password: yup
    .string()
    .required()
    .max(LOGIN_FIELD_MAX_LEN)
    .max(
      LOGIN_FIELD_MAX_LEN,
      `${INPUT_TOO_LONG_MESSAGE}, max length is ${LOGIN_FIELD_MAX_LEN}.`
    ),
});

export function LoginPage() {
  const [showInvalidCredentialsMsg, setShowInvalidCredentialsMsg] =
    useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  function logIn(user: UserResponse, accessToken: string) {
    authContext.setLoggedInUser(user);
    saveToken(accessToken);
    navigate("/home");
  }

  function onFormSubmit(form: LoginForm) {
    postLoginRequest({
      username: form.username,
      password: form.password,
    }).then((response) => {
      if (response.isOk) {
        logIn(response.data.user, response.data.accessToken);
      }
      setShowInvalidCredentialsMsg(
        response.errorCode === ErrorCode.INVALID_CREDENTIALS
      );
    });
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto">
          <Typography variant="h3" element="h3" className="text-center">
            Login
          </Typography>
          <div className="mt-10">
            <Formik
              initialValues={initialFormValues}
              onSubmit={onFormSubmit}
              validationSchema={formValidationSchema}
            >
              {(formik) => (
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col space-y-3"
                >
                  <InputField name="username" label="Username" />
                  <PasswordInputField name="password" label="Password" />
                  <Button
                    variant="filled"
                    color="primary"
                    type="submit"
                    className="w-full"
                  >
                    Login
                  </Button>
                </form>
              )}
            </Formik>
          </div>
          <div className="mt-10">
            <Link to="/signup" className="text-center">
              <Typography variant="text" element="p">
                <strong className="text-gray-500">Sign up</strong>
              </Typography>
            </Link>
          </div>
          {showInvalidCredentialsMsg && (
            <div className="w-full bg-red-600 p-3 rounded-md mt-5">
              <Typography variant="text" element="h4">
                <div className="flex flex-row space-x-3">
                  <Icon type="x-circle" className="text-white" />
                  <p className="text-white">Invalid credentials</p>
                </div>
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

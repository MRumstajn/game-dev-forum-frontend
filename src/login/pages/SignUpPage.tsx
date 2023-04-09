import { useContext, useState } from "react";

import { Button, Typography } from "@tiller-ds/core";
import { InputField, PasswordInputField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { ErrorCode } from "../../common/api/ErrorCode";
import { UserResponse } from "../../common/api/UserResponse";
import { AuthContext } from "../../common/components/AuthProvider";
import {
  INPUT_TOO_LONG_MESSAGE,
  LOGIN_FIELD_MAX_LEN,
  PASSWORD_DOES_NOT_MATCH_MESSAGE,
} from "../../common/constants";
import { saveToken } from "../../util/jwtTokenUtils";
import { postCreateUserRequest } from "../api/postCreateUserRequest";
import { postLoginRequest } from "../api/postLoginRequest";

type SignUpForm = {
  username: string;

  password: string;

  repeatPassword: string;
};

const initialFormValues = {
  username: "",

  password: "",

  repeatPassword: "",
} as SignUpForm;

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
  repeatPassword: yup
    .string()
    .required()
    .max(LOGIN_FIELD_MAX_LEN)
    .max(
      LOGIN_FIELD_MAX_LEN,
      `${INPUT_TOO_LONG_MESSAGE}, max length is ${LOGIN_FIELD_MAX_LEN}.`
    )
    .oneOf([yup.ref("password")], PASSWORD_DOES_NOT_MATCH_MESSAGE),
});

export function SignUpPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  function logIn(user: UserResponse, accessToken: string) {
    authContext.setLoggedInUser(user);
    saveToken(accessToken);
    navigate("/home");
  }

  function onFormSubmit(form: SignUpForm) {
    setErrorMsg("");

    postCreateUserRequest({
      username: form.username,
      password: form.password,
    }).then((response) => {
      if (response.isOk) {
        postLoginRequest({
          username: form.username,
          password: form.password,
        }).then((loginResponse) => {
          if (loginResponse.isOk) {
            logIn(loginResponse.data.user, loginResponse.data.accessToken);
          } else {
            setErrorMsg("Account created, but failed to log in");
          }
        });
      } else {
        if (response.errorCode === ErrorCode.DUPLICATE_RESOURCE) {
          setErrorMsg("That username is taken");
        } else {
          setErrorMsg("Error creating account.\nCode: " + response.errorCode);
        }
      }
    });
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto">
          <Typography variant="h3" element="h3" className="text-center">
            Sign up
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
                  <PasswordInputField
                    name="repeatPassword"
                    label="Repeat password"
                  />
                  <Button
                    variant="filled"
                    color="primary"
                    type="submit"
                    className="w-full"
                  >
                    Sign up
                  </Button>
                </form>
              )}
            </Formik>
          </div>
          {errorMsg.length > 0 && (
            <div className="w-full bg-red-600 p-3 rounded-md mt-10">
              <Typography variant="text" element="h4">
                <div className="flex flex-row space-x-3">
                  <Icon type="x-circle" className="text-white" />
                  <p className="text-white">{errorMsg}</p>
                </div>
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

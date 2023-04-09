import { useContext } from "react";

import { Modal, UseModal } from "@tiller-ds/alert";
import { Button, Typography } from "@tiller-ds/core";
import { PasswordInputField } from "@tiller-ds/formik-elements";

import { Formik } from "formik";
import * as yup from "yup";

import { AuthContext } from "../../common/components/AuthProvider";
import {
  INPUT_REQUIRED_MESSAGE,
  SAME_PASSWORD_MESSAGE,
} from "../../common/constants";
import { saveToken } from "../../util/jwtTokenUtils";
import { postChangeUserPasswordRequest } from "../api/postChangeUserPasswordRequest";

type Form = {
  currentPassword: string;

  newPassword: string;
};

const initialFormValues = {
  currentPassword: "",

  newPassword: "",
} as Form;

const validationSchema = yup.object().shape({
  currentPassword: yup.string().required(INPUT_REQUIRED_MESSAGE),
  newPassword: yup
    .string()
    .notOneOf([yup.ref("currentPassword")], SAME_PASSWORD_MESSAGE)
    .required(INPUT_REQUIRED_MESSAGE),
});

type ChangePasswordModalProps = {
  modal: UseModal<unknown>;
};

export function ChangePasswordModal({ modal }: ChangePasswordModalProps) {
  const authContext = useContext(AuthContext);

  function formSubmitHandler(form: Form) {
    if (!authContext.loggedInUser) {
      return;
    }

    postChangeUserPasswordRequest({
      userId: authContext.loggedInUser.id,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    }).then((response) => {
      authContext.setLoggedInUser(response.data.user);
      saveToken(response.data.newAccessToken);
      modal.onClose();
    });
  }

  return (
    <Modal {...modal}>
      <Modal.Content title="Change password">
        <Formik
          initialValues={initialFormValues}
          onSubmit={formSubmitHandler}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-y-5 mt-10">
                <div className="flex flex-row gap-x-3 justify-between">
                  <Typography variant="text" element="p">
                    Current password:
                  </Typography>
                  <PasswordInputField name="currentPassword" />
                </div>
                <div className="flex flex-row gap-x-3 justify-between">
                  <Typography variant="text" element="p">
                    New password:
                  </Typography>
                  <PasswordInputField name="newPassword" />
                </div>
                <div className="flex flex-row gap-x-3 justify-end mt-5">
                  <Button
                    variant="filled"
                    color="danger"
                    type="reset"
                    onClick={() => modal.onClose()}
                  >
                    Cancel
                  </Button>
                  <Button variant="filled" color="primary" type="submit">
                    Save changes
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  );
}

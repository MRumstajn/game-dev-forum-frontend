import { useContext } from "react";

import { Modal, UseModal } from "@tiller-ds/alert";
import { Button } from "@tiller-ds/core";
import { InputField, TextareaField } from "@tiller-ds/formik-elements";

import { Formik } from "formik";
import * as yup from "yup";

import { postCreateThreadRequest } from "../api/postCreateThreadRequest";
import { ThreadResponse } from "../api/ThreadResponse";
import { AuthContext } from "../components/AuthProvider";

type Form = {
  title: string;
  firstPostContent: string;
};

const initialFormValues = {
  title: "",
  firstPostContent: "",
} as Form;

const formValidationSchema = yup.object().shape({
  title: yup.string().required().min(3).nullable(),
  firstPostContent: yup.string().required().min(3).nullable(),
});

type CreateThreadModalProps = {
  modal: UseModal<unknown>;

  categoryId?: number;

  onThreadCreatedCallback: (thread: ThreadResponse) => void;
};

export function CreateThreadModal({
  modal,
  categoryId,
  onThreadCreatedCallback,
}: CreateThreadModalProps) {
  const authContext = useContext(AuthContext);

  function formSubmitHandler(form: Form) {
    if (
      categoryId === undefined ||
      authContext.loggedInUser?.id === undefined
    ) {
      return;
    }

    postCreateThreadRequest({
      title: form.title,
      firstPostContent: form.firstPostContent,
      categoryId: categoryId,
      authorId: authContext.loggedInUser?.id,
    }).then((response) => onThreadCreatedCallback(response.data));

    modal.onClose();
  }

  return (
    <Modal {...modal}>
      <Modal.Content title="Create new thread">
        <Formik
          initialValues={initialFormValues}
          onSubmit={formSubmitHandler}
          validationSchema={formValidationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-y-5">
                <InputField
                  name="title"
                  minLength={3}
                  required={true}
                  label="Title"
                />
                <TextareaField
                  minLength={3}
                  name="firstPostContent"
                  required={true}
                  label="First post"
                />
                <div className="flex flex-row gap-x-5 justify-end items-end">
                  <Button variant="outlined" onClick={modal.onClose}>
                    Cancel
                  </Button>
                  <Button variant="filled" type="submit">
                    Create
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

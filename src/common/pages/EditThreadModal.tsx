import { Modal, UseModal } from "@tiller-ds/alert";
import { Button, Typography } from "@tiller-ds/core";
import { InputField } from "@tiller-ds/formik-elements";

import { Formik } from "formik";
import * as yup from "yup";

import {
  INPUT_REQUIRED_MESSAGE,
  INPUT_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
} from "../constants";

type EditThreadModalProps = {
  modal: UseModal<unknown>;
  oldTitle?: string;
  confirmCallback: (newTitle: string) => void;
  cancelCallback?: () => void;
};

type Form = {
  title: string;
};

const formValidationSchema = yup.object({
  title: yup
    .string()
    .min(3, INPUT_TOO_SHORT_MESSAGE)
    .max(30, INPUT_TOO_LONG_MESSAGE)
    .required(INPUT_REQUIRED_MESSAGE),
});

export function EditThreadModal({
  modal,
  oldTitle,
  confirmCallback,
  cancelCallback,
}: EditThreadModalProps) {
  function formSubmitHandler(form: Form) {
    confirmCallback(form.title);
    modal.onClose();
  }

  return (
    <Modal {...modal}>
      <Modal.Content title="Edit thread">
        <Formik
          initialValues={{ title: oldTitle ? oldTitle : "" }}
          onSubmit={formSubmitHandler}
          validationSchema={formValidationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-row gap-x-1 items-center py-3">
                <Typography variant="text" element="p">
                  Title:
                </Typography>
                <InputField name="title" />
              </div>
              <div className="flex flex-row gap-x-3 justify-end">
                <Button
                  color="danger"
                  onClick={() => {
                    if (cancelCallback) {
                      cancelCallback();
                    }
                    modal.onClose();
                  }}
                  type="reset"
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  );
}

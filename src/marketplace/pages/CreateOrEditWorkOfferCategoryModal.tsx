import { useEffect, useState } from "react";

import { Modal, UseModal } from "@tiller-ds/alert";
import { Button, Typography } from "@tiller-ds/core";
import { InputField, TextareaField } from "@tiller-ds/formik-elements";

import { Formik } from "formik";
import * as yup from "yup";

import {
  INPUT_REQUIRED_MESSAGE,
  INPUT_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
} from "../../common/constants";
import { postCreateWorkOfferCategoryRequest } from "../api/postCreateWorkOfferCategoryRequest";
import { putEditWorkOfferCategoryRequest } from "../api/putEditWorkOfferCategoryRequest";
import { WorkOfferCategoryResponse } from "../api/WorkOfferCategoryResponse";

type EditWorkOfferCategoryModalProps = {
  modal: UseModal<unknown>;
  workOfferCategory?: WorkOfferCategoryResponse;
  confirmCallback?: (workOfferCategory: WorkOfferCategoryResponse) => void;
  cancelCallback?: () => void;
};

type Form = {
  title: string;
  description: string | null;
};

const initialFormValues = {
  title: "",
  description: null,
} as Form;

const formValidationSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, INPUT_TOO_SHORT_MESSAGE)
    .max(30, INPUT_TOO_LONG_MESSAGE)
    .required(INPUT_REQUIRED_MESSAGE),
  description: yup
    .string()
    .min(3, INPUT_TOO_SHORT_MESSAGE)
    .max(200, INPUT_TOO_LONG_MESSAGE)
    .nullable(),
});

export function CreateOrEditWorkOfferCategoryModal({
  modal,
  workOfferCategory,
  confirmCallback,
  cancelCallback,
}: EditWorkOfferCategoryModalProps) {
  const [formValues, setFormValues] = useState<Form>(initialFormValues);

  function onFormSubmitHandler(form: Form) {
    if (workOfferCategory) {
      putEditWorkOfferCategoryRequest(workOfferCategory.id, {
        title: form.title,
        description: form.description,
      }).then((response) => {
        if (confirmCallback) {
          confirmCallback(response.data);
        }
        modal.onClose();
      });
    } else {
      postCreateWorkOfferCategoryRequest({
        title: form.title,
        description: form.description,
      }).then((response) => {
        if (confirmCallback) {
          confirmCallback(response.data);
        }
        modal.onClose();
      });
    }
  }

  useEffect(() => {
    if (workOfferCategory) {
      setFormValues({
        title: workOfferCategory.title,
        description: workOfferCategory.description,
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [workOfferCategory]);

  return (
    <Modal {...modal}>
      <Modal.Content
        title={
          workOfferCategory
            ? workOfferCategory.title
            : "Create new work category"
        }
      >
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={onFormSubmitHandler}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-1">
                  <Typography variant="text" element="p">
                    Title:
                  </Typography>
                  <InputField name="title" />
                </div>
                <div className="flex flex-col gap-y-1">
                  <Typography variant="text" element="p">
                    Description:
                  </Typography>
                  <TextareaField name="description" />
                </div>
              </div>

              <div className="flex flex-row justify-end gap-x-3 mt-5">
                <Button
                  variant="filled"
                  color="primary"
                  type="reset"
                  onClick={() => {
                    if (cancelCallback) {
                      cancelCallback();
                    }

                    modal.onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="filled" color="primary" type="submit">
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

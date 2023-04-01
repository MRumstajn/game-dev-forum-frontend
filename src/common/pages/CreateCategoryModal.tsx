import { Modal, UseModal } from "@tiller-ds/alert";
import { Button } from "@tiller-ds/core";
import { InputField } from "@tiller-ds/formik-elements";

import { Formik } from "formik";
import * as yup from "yup";

import { CategoryResponse } from "../api/CategoryResponse";
import { postCreateCategoryRequest } from "../api/postCreateCategoryRequest";

type Form = {
  title: string;
};

const initialFormValues = {
  title: "",
} as Form;

const validationSchema = yup.object().shape({
  title: yup.string().required().min(3).nullable(),
});

type CreateCategoryModalProps = {
  modal: UseModal<unknown>;

  onCreateCategoryCallback: (category: CategoryResponse) => void;

  sectionId?: number;
};

export function CreateCategoryModal({
  modal,
  onCreateCategoryCallback,
  sectionId,
}: CreateCategoryModalProps) {
  function formSubmitHandler(form: Form) {
    if (sectionId === undefined) {
      return;
    }

    postCreateCategoryRequest({
      title: form.title,
      sectionId: sectionId,
    }).then((category) => onCreateCategoryCallback(category));

    modal.onClose();
  }

  return (
    <Modal {...modal}>
      <Modal.Content title="Create category">
        <Formik
          initialValues={initialFormValues}
          onSubmit={formSubmitHandler}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-y-3">
                <InputField name="title" label="Title" />
                <div className="flex flex-row gap-x-5 justify-end items-end">
                  <Button variant="outlined" onClick={() => modal.onClose()}>
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

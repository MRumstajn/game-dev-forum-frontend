import React, { useEffect, useState } from "react";

import { Breadcrumbs, Button, Typography } from "@tiller-ds/core";
import {
  InputField,
  NumberInputField,
  TextareaField,
} from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import {
  INPUT_REQUIRED_MESSAGE,
  INPUT_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
  WORK_OFFER_MIN_PRICE_MESSAGE,
} from "../../common/constants";
import { getWorkOfferById } from "../api/getWorkOfferById";
import { postCreateWorkOfferRequest } from "../api/postCreateWorkOfferRequest";
import { putEditWorkOfferRequest } from "../api/putEditWorkOfferRequest";
import { WorkOfferResponse } from "../api/WorkOfferResponse";

type ServiceForm = {
  title: string;
  description: string;
  pricePerHour: number;
  currencySymbol: string;
};

const initialFormValues = {
  title: "",
  description: "",
  pricePerHour: 0,
  currencySymbol: "",
} as ServiceForm;

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
    .required(INPUT_REQUIRED_MESSAGE),
  pricePerHour: yup
    .number()
    .min(0, WORK_OFFER_MIN_PRICE_MESSAGE)
    .required(INPUT_REQUIRED_MESSAGE),
  currencySymbol: yup
    .string()
    .min(1)
    .max(1, INPUT_TOO_LONG_MESSAGE)
    .required(INPUT_REQUIRED_MESSAGE),
});

export function WorkOfferCreateOrEditPage() {
  const [workOffer, setWorkOffer] = useState<WorkOfferResponse>();
  const [formValues, setFormValues] = useState<ServiceForm>(initialFormValues);
  const [reInitFormik, setReInitFormik] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  const previousUrl = `/marketplace/${workOffer?.workOfferCategoryId}/${workOffer?.id}`;

  useEffect(() => {
    if (params.workOfferId) {
      const workOfferId = Number(params.workOfferId);
      getWorkOfferById(workOfferId).then((response) => {
        setWorkOffer(response.data);
      });
    }
  }, [params.workOfferId]);

  useEffect(() => {
    if (workOffer) {
      setFormValues({
        title: workOffer.title,
        description: workOffer.description,
        pricePerHour: workOffer.pricePerHour,
        currencySymbol: workOffer.currencySymbol,
      });
    } else {
      setFormValues(initialFormValues);
    }

    setReInitFormik(true);
  }, [workOffer]);

  useEffect(() => {
    if (reInitFormik) {
      setReInitFormik(false);
    }
  }, [reInitFormik]);

  function formSubmitHandler(form: ServiceForm) {
    const { title, description, pricePerHour, currencySymbol } = form;

    if (workOffer) {
      putEditWorkOfferRequest(workOffer.id, {
        title: title,
        description: description,
        pricePerHour: pricePerHour,
        currencySymbol: currencySymbol,
        workOfferCategoryId: workOffer.workOfferCategoryId,
      }).then(() => navigate(previousUrl));
    } else if (params.categoryId) {
      postCreateWorkOfferRequest({
        title: title,
        description: description,
        pricePerHour: pricePerHour,
        currencySymbol: currencySymbol,
        workOfferCategoryId: Number(params.categoryId),
      }).then(() => navigate("/marketplace"));
    }
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
              <Link to="/marketplace">Marketplace</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>
              Edit {workOffer?.title}
            </Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <Formik
              initialValues={formValues}
              validationSchema={formValidationSchema}
              onSubmit={formSubmitHandler}
              enableReinitialize={reInitFormik}
            >
              {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex flex-col space-y-20">
                    <div className="flex flex-col gap-y-20">
                      <div className="flex flex-col gap-y-1">
                        <Typography variant="text" element="p">
                          <strong>Title:</strong>
                        </Typography>
                        <InputField name="title" />
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <Typography variant="text" element="p">
                          <strong>Description:</strong>
                        </Typography>
                        <TextareaField name="description" />
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-y-1">
                          <Typography variant="text" element="p">
                            <strong>Price per hour:</strong>
                          </Typography>
                          <div className="flex flex-row gap-x-1">
                            <NumberInputField
                              name="pricePerHour"
                              className="w-3/12"
                            />
                            <InputField
                              name="currencySymbol"
                              className="w-3/12"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b mt-10 mb-5" />
                  <div className="flex flex-row justify-end gap-x-3">
                    <Button
                      variant="filled"
                      color="primary"
                      type="reset"
                      onClick={() => navigate(previousUrl)}
                    >
                      Cancel
                    </Button>
                    <Button variant="filled" color="primary" type="submit">
                      Save changes
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

import { useContext, useEffect, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import {
  Breadcrumbs,
  Button,
  Card,
  Pagination,
  Typography,
} from "@tiller-ds/core";
import { InputField, NumberInputField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { CreateOrEditWorkOfferCategoryModal } from "./CreateOrEditWorkOfferCategoryModal";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import {
  INPUT_TOO_LONG_MESSAGE,
  MAX_WORK_OFFER_CATEGORY_TITLE_LENGTH,
  WORK_OFFER_RATE_RANGE_MESSAGE,
} from "../../common/constants";
import { postSearchWorkOfferCategorySearchRequest } from "../api/postSearchWorkOfferCategorySearchRequest";
import { postSearchWorkOfferRequest } from "../api/postSearchWorkOfferRequest";
import { SearchWorkOffersRequestPageable } from "../api/SearchWorkOffersRequestPageable";
import { WorkOfferCategoryResponse } from "../api/WorkOfferCategoryResponse";
import { WorkOfferResponse } from "../api/WorkOfferResponse";
import { WorkOfferCategoryContainer } from "../components/WorkOfferCategoryContainer";

type FilterForm = {
  title: string;
  authorUsername: string;
  averageRating: number;
};

const filterFormInitialValues = {
  title: "",
  authorUsername: "",
  averageRating: 0,
} as FilterForm;

const filterFormValidationSchema = yup.object().shape({
  title: yup
    .string()
    .max(MAX_WORK_OFFER_CATEGORY_TITLE_LENGTH, INPUT_TOO_LONG_MESSAGE),
  averageRating: yup
    .number()
    .min(1, WORK_OFFER_RATE_RANGE_MESSAGE)
    .max(5, WORK_OFFER_RATE_RANGE_MESSAGE),
  authorUsername: yup
    .string()
    .max(MAX_WORK_OFFER_CATEGORY_TITLE_LENGTH, INPUT_TOO_LONG_MESSAGE),
});

export function Marketplace() {
  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  const [workOfferCategories, setWorkOfferCategories] = useState<
    WorkOfferCategoryResponse[]
  >([]);
  const [categoryServiceCounts, setCategoryServiceCounts] = useState<{
    [categoryId: number]: number;
  }>({});
  const [workOffers, setWorkOffers] = useState<{
    [categoryId: number]: WorkOfferResponse[];
  }>([]);
  const [page, setPage] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);

  const authContext = useContext(AuthContext);
  const createWorkOfferCategoryModal = useModal();

  function searchWorkOffers(
    request: SearchWorkOffersRequestPageable,
    categoryId: number
  ) {
    postSearchWorkOfferRequest(request).then((response) => {
      setWorkOffers((prevState) => ({
        ...prevState,
        [categoryId]: response.data.content,
      }));
      setCategoryServiceCounts((prevState) => ({
        ...prevState,
        [categoryId]: response.data.totalElements,
      }));
    });
  }

  useEffect(() => {
    postSearchWorkOfferCategorySearchRequest({
      pageNumber: page,
      pageSize: 3,
    }).then((response) => {
      setWorkOfferCategories(response.data.content);
      setTotalCategories(response.data.totalElements);
    });
  }, [page]);

  useEffect(() => {
    workOfferCategories.forEach((category) => {
      searchWorkOffers(
        {
          workOfferCategoryId: category.id,
          pageSize: 5,
          pageNumber: 0,
        },
        category.id
      );
    });
  }, [workOfferCategories]);

  function filterFormSubmitHandler() {}

  return (
    <>
      <div className="m-1 sm:m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            <Breadcrumbs.Breadcrumb>Marketplace</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex controls-mobile:flex-col flex-row gap-y-3 justify-between">
              <Typography variant="h1" element="h1">
                Marketplace
              </Typography>
              <div className="flex controls-mobile:flex-col gap-y-3 flex-row gap-x-3 justify-end mt-5 controls-large:mt-0">
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() => setFilterFormOpen((prevState) => !prevState)}
                  className="controls-mobile:w-full w-fit"
                >
                  <span className="text-white">Filter</span>
                </Button>
                {authContext.loggedInUser?.role === UserRole.ADMIN && (
                  <Button
                    variant="filled"
                    color="primary"
                    onClick={createWorkOfferCategoryModal.onOpen}
                    className="controls-mobile:w-full w-fit"
                  >
                    <span className="text-white">New work category</span>
                  </Button>
                )}
              </div>
            </div>
            {filterFormOpen && (
              <Card className="flex flex-col space-y-10 mt-5">
                <Card.Body className="bg-gray-200">
                  <Formik
                    initialValues={filterFormInitialValues}
                    onSubmit={filterFormSubmitHandler}
                    validationSchema={filterFormValidationSchema}
                  >
                    {(formik) => (
                      <form onSubmit={filterFormSubmitHandler}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5">
                          <div>
                            <InputField
                              name="title"
                              placeholder="Title"
                              label="Author"
                            />
                          </div>
                          <div>
                            <NumberInputField
                              name="averageRating"
                              placeholder="1 - 5"
                              label="Average rating"
                            />
                          </div>
                          <div>
                            <InputField name="authorUsername" label="Author" />
                          </div>
                        </div>
                        <div className="flex flex-col-reverse space-y-reverse space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end mt-10">
                          <Button
                            variant="filled"
                            color="danger"
                            className="w-full sm:w-fit"
                            onClick={() => {
                              formik.resetForm();
                              setFilterFormOpen(false);
                            }}
                          >
                            Clear
                          </Button>
                          <Button
                            variant="filled"
                            color="primary"
                            className="w-full sm:w-fit"
                            type="submit"
                          >
                            Apply
                          </Button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            )}
            <div className="flex flex-col gap-y-10 mt-20">
              {workOfferCategories.map((category) => (
                <WorkOfferCategoryContainer
                  workOfferCategory={category}
                  workOffers={workOffers[category.id]}
                  totalServices={categoryServiceCounts[category.id]}
                  pageChangeCallback={(page) =>
                    searchWorkOffers(
                      {
                        workOfferCategoryId: category.id,
                        pageSize: 5,
                        pageNumber: page,
                      },
                      category.id
                    )
                  }
                  deleteCallback={() =>
                    setWorkOfferCategories((prevState) => [
                      ...prevState.filter(
                        (prevStateCategory) =>
                          prevStateCategory.id !== category.id
                      ),
                    ])
                  }
                />
              ))}
              {workOfferCategories.length == 0 && (
                <Typography variant="subtext" className="text-center">
                  <p>No categories yet</p>
                </Typography>
              )}
            </div>
            {workOfferCategories.length > 0 && (
              <div className="mt-10">
                <Pagination
                  pageNumber={page}
                  pageSize={3}
                  totalElements={totalCategories}
                  onPageChange={setPage}
                >
                  {() => null}
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateOrEditWorkOfferCategoryModal
        modal={createWorkOfferCategoryModal}
        confirmCallback={(category) => {
          setWorkOfferCategories((prevState) => [...prevState, category]);
        }}
      />
    </>
  );
}

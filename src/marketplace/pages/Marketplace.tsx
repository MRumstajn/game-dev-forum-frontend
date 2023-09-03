import { FormEvent, useContext, useEffect, useRef, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import {
  Breadcrumbs,
  Button,
  Card,
  Pagination,
  Typography,
} from "@tiller-ds/core";
import { Input, NumberInput } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import { Link } from "react-router-dom";

import { CreateOrEditWorkOfferCategoryModal } from "./CreateOrEditWorkOfferCategoryModal";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { postSearchWorkOfferCategorySearchRequest } from "../api/postSearchWorkOfferCategorySearchRequest";
import { postSearchWorkOfferRequest } from "../api/postSearchWorkOfferRequest";
import { SearchWorkOfferCategoryRequestPageable } from "../api/SearchWorkOfferCategoryRequestPageable";
import { SearchWorkOffersRequestPageable } from "../api/SearchWorkOffersRequestPageable";
import { WorkOfferCategoryResponse } from "../api/WorkOfferCategoryResponse";
import { WorkOfferResponse } from "../api/WorkOfferResponse";
import { WorkOfferCategoryContainer } from "../components/WorkOfferCategoryContainer";

export function Marketplace() {
  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  const [filterUsed, setFilterUsed] = useState<boolean>(false);
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
  const [authorFilter, setAuthorFilter] = useState<string>();
  const [titleFilter, setTitleFilter] = useState<string>();
  const [priceMinFilter, setPriceMinFilter] = useState<number>();
  const [priceMaxFilter, setPriceMaxFilter] = useState<number>();
  const [filteringWhichCategory, setFilteringWhichCategory] =
    useState<WorkOfferCategoryResponse>();

  const authContext = useContext(AuthContext);
  const createWorkOfferCategoryModal = useModal();
  const filterFormRef = useRef<any>();

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

  function loadInitialWorkOffersForAllCategories() {
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
  }

  function fetchCategories(request: SearchWorkOfferCategoryRequestPageable) {
    postSearchWorkOfferCategorySearchRequest(request).then((response) => {
      setWorkOfferCategories(response.data.content);
      setTotalCategories(response.data.totalElements);
    });
  }

  useEffect(() => {
    fetchCategories({
      pageNumber: page,
      pageSize: 3,
    });
  }, [page]);

  useEffect(() => {
    if (filterUsed) {
      return;
    }

    loadInitialWorkOffersForAllCategories();
  }, [workOfferCategories]);

  function resetFilter() {
    setAuthorFilter(undefined);
    setPriceMinFilter(undefined);
    setPriceMaxFilter(undefined);
    setTitleFilter(undefined);

    if (filterUsed) {
      loadInitialWorkOffersForAllCategories();

      setFilterUsed(false);
    }

    setFilterFormOpen(false);

    fetchCategories({
      pageNumber: 0,
      pageSize: 3,
    });
  }
  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!filteringWhichCategory) {
      return;
    }

    let request = {
      title: titleFilter,
      authorUsername: authorFilter,
      workOfferCategoryId: filteringWhichCategory.id,
      pricePerHourFromIncluding: priceMinFilter,
      pricePerHourToIncluding: priceMaxFilter,
      pageNumber: 0,
      pageSize: 3,
    } as SearchWorkOffersRequestPageable;

    postSearchWorkOfferRequest(request).then((response) => {
      let prevWorkOfferState = workOffers;
      prevWorkOfferState[filteringWhichCategory.id] = [];

      for (let offer of response.data.content) {
        prevWorkOfferState[offer.workOfferCategoryId] = response.data.content;
      }

      setWorkOfferCategories((prevState) =>
        prevState.filter(
          (category) => category.id === request.workOfferCategoryId
        )
      );

      setWorkOffers(prevWorkOfferState);
    });

    setFilterUsed(true);
  }

  useEffect(() => {
    if (filterFormOpen) {
      filterFormRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [filterFormOpen]);

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
                  <form onSubmit={filterFormSubmitHandler} ref={filterFormRef}>
                    <Typography variant="title">
                      Filtering category "{filteringWhichCategory?.title}"
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-5 mt-3">
                      <div>
                        <Input
                          name="author"
                          placeholder="Author"
                          label="Author"
                          onChange={(event) =>
                            setAuthorFilter(event.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-row space-x-1">
                        <NumberInput
                          name="priceMin"
                          label="Min price"
                          onChange={setPriceMinFilter}
                          className="w-1/2"
                        />
                        <NumberInput
                          name="priceMax"
                          label="Max price"
                          onChange={setPriceMaxFilter}
                          className="w-1/2"
                        />
                      </div>
                      <div>
                        <Input
                          name="title"
                          placeholder="Title"
                          label="Title"
                          onChange={(e) => setTitleFilter(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col-reverse space-y-reverse space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end mt-10">
                      <Button
                        variant="filled"
                        color="danger"
                        className="w-full sm:w-fit"
                        onClick={() => {
                          resetFilter();
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
                  filterCallback={(categoryId) => {
                    setFilteringWhichCategory(
                      workOfferCategories.find(
                        (category) => category.id === categoryId
                      )
                    );
                    setFilterFormOpen(true);
                  }}
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

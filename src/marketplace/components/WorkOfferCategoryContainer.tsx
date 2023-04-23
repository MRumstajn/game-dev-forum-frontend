import { useContext, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import { Card, IconButton, Pagination, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { useNavigate } from "react-router-dom";

import { WorkOfferCard } from "./WorkOfferCard";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { CreateCard } from "../../common/components/CreateCard";
import { ConfirmDeleteModal } from "../../common/pages/ConfirmDeleteModal";
import { deleteWorkOfferCategory } from "../api/deleteWorkOfferCategory";
import { WorkOfferCategoryResponse } from "../api/WorkOfferCategoryResponse";
import { WorkOfferResponse } from "../api/WorkOfferResponse";
import { CreateOrEditWorkOfferCategoryModal } from "../pages/CreateOrEditWorkOfferCategoryModal";

type WorkOfferCategoryContainerProps = {
  workOfferCategory: WorkOfferCategoryResponse;
  workOffers: WorkOfferResponse[] | undefined;
  totalServices: number;
  pageChangeCallback: (page: number) => void;
  deleteCallback: () => void;
};

export function WorkOfferCategoryContainer({
  workOfferCategory,
  workOffers,
  totalServices,
  pageChangeCallback,
  deleteCallback,
}: WorkOfferCategoryContainerProps) {
  const [page, setPage] = useState<number>(0);
  //eslint-disable-next-line
  const [render, setRender] = useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const editCategoryModal = useModal();
  const confirmDeleteModal = useModal();

  function deleteCategory() {
    deleteWorkOfferCategory(workOfferCategory.id).then(() => deleteCallback());
  }

  return (
    <>
      <div className="flex flex-col">
        {workOffers && (
          <Card className="border-2">
            <Card.Header>
              <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                  <Typography variant="title" element="h3">
                    {workOfferCategory.title}
                  </Typography>
                  {authContext.loggedInUser &&
                    authContext.loggedInUser.role === UserRole.ADMIN && (
                      <div className="flex flex-row gap-x-3">
                        <IconButton
                          icon={<Icon type="pencil" />}
                          onClick={editCategoryModal.onOpen}
                          label="Edit"
                          className="text-gray-600"
                        />
                        <IconButton
                          icon={<Icon type="trash" />}
                          onClick={confirmDeleteModal.onOpen}
                          label="Delete"
                          className="text-gray-600"
                        />
                      </div>
                    )}
                </div>
                {workOfferCategory.description ? (
                  <Typography variant="text" element="p">
                    {workOfferCategory.description}
                  </Typography>
                ) : (
                  <Typography variant="subtext" element="p">
                    No description
                  </Typography>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <div className="flex flex-col gap-y-3">
                {workOffers.map((workOffer) => (
                  <WorkOfferCard
                    workOffer={workOffer}
                    clickCallback={() =>
                      navigate(
                        `/marketplace/${workOfferCategory.id}/${workOffer.id}`
                      )
                    }
                  />
                ))}
                {workOffers.length === 0 && (
                  <Typography variant="subtext" element="p">
                    No services at the moment
                  </Typography>
                )}
                <CreateCard
                  label={"Offer service"}
                  clickCallback={() =>
                    navigate(`/marketplace/${workOfferCategory.id}/new`)
                  }
                />
              </div>
            </Card.Body>
            <Card.Footer className="bg-slate-100">
              <div className="flex flex-row justify-between items-center">
                <Typography variant="text" element="p">
                  Services: {totalServices}
                </Typography>
                <Pagination
                  pageNumber={page}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    pageChangeCallback(newPage);
                  }}
                  pageSize={5}
                  totalElements={totalServices}
                  tokens={{
                    default: {
                      backgroundColor: "none",
                      textColor: "text-slate-600",
                      borderColor: "none",
                    },
                    current: {
                      backgroundColor: "none hover:bg-navy-100",
                      textColor: "text-black",
                      borderColor: "none",
                    },
                    pageSummary: {
                      fontSize: "text-sm",
                      lineHeight: "leading-5",
                    },
                  }}
                >
                  {() => null}
                </Pagination>
              </div>
            </Card.Footer>
          </Card>
        )}
      </div>
      <CreateOrEditWorkOfferCategoryModal
        modal={editCategoryModal}
        workOfferCategory={workOfferCategory}
        confirmCallback={(category) => {
          workOfferCategory.title = category.title;
          workOfferCategory.description = category.description;
          setRender((prevState) => !prevState);
        }}
      />
      <ConfirmDeleteModal
        modal={confirmDeleteModal}
        confirmCallback={deleteCategory}
      />
    </>
  );
}

import React, { useContext, useEffect, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import { Breadcrumbs, Button, IconButton, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link, useNavigate, useParams } from "react-router-dom";

import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { ConfirmDeleteModal } from "../../common/pages/ConfirmDeleteModal";
import { deleteWorkOffer } from "../api/deleteWorkOffer";
import { getWorkOfferById } from "../api/getWorkOfferById";
import { postRateWorkOfferRequest } from "../api/postRateWorkOfferRequest";
import { postWorkOfferTotalAndAverageRatingRequest } from "../api/postWorkOfferTotalAndAverageRatingRequest";
import { WorkOfferAverageAndTotalRatingResponse } from "../api/WorkOfferAverageAndTotalRatingResponse";
import { WorkOfferResponse } from "../api/WorkOfferResponse";
import { MessageDialog } from "../components/MessageDialog";

export function WorkOfferPreviewPage() {
  const [workOffer, setWorkOffer] = useState<WorkOfferResponse>();
  const [ratings, setRatings] =
    useState<WorkOfferAverageAndTotalRatingResponse>();
  const [messageFormOpen, setMessageFormOpen] = useState<boolean>(false);

  const params = useParams();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const confirmDeleteModal = useModal();

  function getRatingData(workOfferId: number) {
    postWorkOfferTotalAndAverageRatingRequest({
      workOfferIds: [workOfferId],
    }).then((response) => setRatings(response.data[0]));
  }

  useEffect(() => {
    const workOfferId = Number(params.workOfferId);
    getWorkOfferById(workOfferId).then((response) => {
      setWorkOffer(response.data);
    });
  }, [params.workOfferId]);

  useEffect(() => {
    if (workOffer) {
      getRatingData(workOffer.id);
    }
  }, [workOffer]);

  function rateService(newRating: number) {
    if (!workOffer) {
      return;
    }

    postRateWorkOfferRequest({
      workOfferId: workOffer.id,
      rating: newRating,
    }).then((response) => {
      if (response.isOk) {
        getRatingData(workOffer.id);
      }
    });
  }

  function generateStarIconRow(starCount: number): React.ReactNode[] {
    if (starCount > 5) {
      starCount = 5;
    }

    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <IconButton
          icon={
            <Icon
              type="star"
              variant={i + 1 > starCount ? "light" : "fill"}
              className={`text-${
                i + 1 <= starCount ? "orange" : "gray"
              }-600 hover:text-orange-600`}
            />
          }
          onClick={() => rateService(i + 1)}
          label={`Rate - ${i + 1}`}
        />
      );
    }

    return stars;
  }

  function deleteThisWorkOffer() {
    if (!workOffer) {
      return;
    }

    deleteWorkOffer(workOffer.id).then((response) => {
      if (response.ok) {
        navigate("/marketplace");
      }
    });
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
            <Breadcrumbs.Breadcrumb>{workOffer?.title}</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex flex-col space-y-20">
              <div className="flex flex-row justify-between">
                <Typography variant="h1" element="h1">
                  {workOffer?.title}
                </Typography>
                {authContext.loggedInUser &&
                  (authContext.loggedInUser.id === workOffer?.author.id ||
                    authContext.loggedInUser.role === UserRole.ADMIN) && (
                    <div className="flex flex-row gap-x-3">
                      <Button
                        variant="filled"
                        color="primary"
                        onClick={() => {
                          workOffer &&
                            navigate(
                              `/marketplace/${workOffer.workOfferCategoryId}/${workOffer.id}/edit`
                            );
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="filled"
                        color="danger"
                        onClick={confirmDeleteModal.onOpen}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
              </div>
              <div className="flex flex-col gap-y-20">
                <div className="flex flex-col gap-y-1">
                  <Typography variant="text" element="p">
                    <strong>Description:</strong>
                  </Typography>
                  <Typography variant="text" element="p">
                    {workOffer?.description}
                  </Typography>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-y-1">
                    <Typography variant="text" element="p">
                      <strong>Service offered by:</strong>
                    </Typography>
                    <Typography variant="text" element="p">
                      {workOffer?.author.username}
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <Typography variant="text" element="p">
                      <strong>Price per hour:</strong>
                    </Typography>
                    <Typography variant="text" element="p">
                      {workOffer?.pricePerHour} {workOffer?.currencySymbol}
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <Typography variant="text" element="p">
                      <strong>
                        Average rating ({ratings?.totalRatings} ratings):
                      </strong>
                    </Typography>
                    <div className="flex flex-row gap-x-1">
                      {ratings
                        ? generateStarIconRow(ratings.averageRating)
                        : []}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b mt-10 mb-5" />
            {!messageFormOpen &&
              authContext.loggedInUser &&
              authContext.loggedInUser?.id !== workOffer?.author.id && (
                <div className="flex flex-row justify-end">
                  <Button
                    variant="filled"
                    color="primary"
                    trailingIcon={<Icon type="envelope" />}
                    onClick={() => setMessageFormOpen(true)}
                  >
                    Message user
                  </Button>
                </div>
              )}
            {messageFormOpen && <MessageDialog />}
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        modal={confirmDeleteModal}
        confirmCallback={() => deleteThisWorkOffer()}
      />
    </>
  );
}
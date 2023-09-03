import React, { useContext, useEffect, useState } from "react";

import { useModal } from "@tiller-ds/alert";
import { Breadcrumbs, Button, IconButton, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { Link, useNavigate, useParams } from "react-router-dom";

import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { ConfirmDeleteModal } from "../../common/pages/ConfirmDeleteModal";
import { deleteWorkOffer } from "../api/deleteWorkOffer";
import { deleteWorkOfferRating } from "../api/deleteWorkOfferRating";
import { getWorkOfferById } from "../api/getWorkOfferById";
import { postRateWorkOfferRequest } from "../api/postRateWorkOfferRequest";
import { postSearchWorkOfferRatingRequest } from "../api/postSearchWorkOfferRatingRequest";
import { postWorkOfferTotalAndAverageRatingRequest } from "../api/postWorkOfferTotalAndAverageRatingRequest";
import { WorkOfferAverageAndTotalRatingResponse } from "../api/WorkOfferAverageAndTotalRatingResponse";
import { WorkOfferRatingResponse } from "../api/WorkOfferRatingResponse";
import { WorkOfferResponse } from "../api/WorkOfferResponse";

export function WorkOfferPreviewPage() {
  const [workOffer, setWorkOffer] = useState<WorkOfferResponse>();
  const [averageTotalRatings, setAverageTotalRatings] =
    useState<WorkOfferAverageAndTotalRatingResponse>();
  const [userRating, setUserRating] = useState<WorkOfferRatingResponse>();
  const params = useParams();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const confirmDeleteModal = useModal();

  function getRatingData(workOfferId: number) {
    postWorkOfferTotalAndAverageRatingRequest({
      workOfferIds: [workOfferId],
    }).then((response) => {
      setAverageTotalRatings(response.data[0]);
    });
  }

  useEffect(() => {
    if (!workOffer || !authContext.loggedInUser) {
      return;
    }

    postSearchWorkOfferRatingRequest({
      workOfferId: workOffer.id,
      userId: authContext.loggedInUser.id,
    }).then((response) => {
      if (response.isOk && response.data.length > 0) {
        setUserRating(response.data[0]);
      }
    });
  }, [authContext.loggedInUser, workOffer]);

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
      setUserRating(response.data);
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
              style={{
                color: i + 1 <= starCount ? "rgb(255, 165, 0)" : "gray",
              }}
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

  function clearRatingHandler() {
    if (!userRating || !workOffer) {
      return;
    }

    deleteWorkOfferRating(userRating.id).then((response) => {
      if (response.isOk) {
        getRatingData(workOffer.id);
        setUserRating(undefined);
      }
    });
  }

  return (
    <>
      <div className="m-1 sm:m-10">
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
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <Typography variant="h1" element="h1">
                  {workOffer?.title}
                </Typography>
                {authContext.loggedInUser &&
                  (authContext.loggedInUser.id === workOffer?.author.id ||
                    authContext.loggedInUser.role === UserRole.ADMIN) && (
                    <div className="flex flex-col gap-y-3 sm:flex-row gap-x-3 mt-5 sm:mt-0">
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
                    <pre className="whitespace-pre-wrap">
                      {workOffer?.description}
                    </pre>
                  </Typography>
                </div>
                <div className="flex flex-col gap-y-5 sm:flex-row justify-between">
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
                      <strong>Ratings:</strong>
                    </Typography>
                    <div className="flex flex-row gap-x-1 items-center">
                      <Typography variant="text" element="p" className="">
                        <strong>{averageTotalRatings?.averageRating}</strong>
                      </Typography>
                      <Icon type="star" variant="fill" />
                      <Typography variant="text" element="p" className="ml-3">
                        <strong>
                          {averageTotalRatings?.totalRatings} total rating(s)
                        </strong>
                      </Typography>
                    </div>

                    <div className="flex flex-row gap-x-1 mt-3">
                      {authContext.loggedInUser?.id !==
                        workOffer?.author.id && (
                        <div className="flex flex-row gap-x-1">
                          <Typography variant="text" element="p">
                            Your rating:
                          </Typography>
                          {generateStarIconRow(
                            userRating ? userRating.rating : 0
                          )}
                          {userRating && (
                            <IconButton
                              icon={
                                <Icon type="x" className="text-slate-300" />
                              }
                              label="Clear rating"
                              onClick={() => clearRatingHandler()}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b mt-10 mb-5" />
            {authContext.loggedInUser &&
              authContext.loggedInUser?.id !== workOffer?.author.id && (
                <div className="flex flex-row justify-end">
                  <Button
                    variant="filled"
                    color="primary"
                    trailingIcon={<Icon type="envelope" />}
                    onClick={() =>
                      navigate(`/messaging/new/${workOffer?.author.id}`)
                    }
                  >
                    Message user
                  </Button>
                </div>
              )}
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

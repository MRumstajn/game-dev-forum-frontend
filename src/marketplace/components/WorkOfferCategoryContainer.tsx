import { useContext, useState } from "react";

import { Card, IconButton, Pagination, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

import { useNavigate } from "react-router-dom";

import { WorkOfferCard } from "./WorkOfferCard";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { CreateCard } from "../../common/components/CreateCard";
import { WorkOfferCategoryResponse } from "../api/WorkOfferCategoryResponse";
import { WorkOfferResponse } from "../api/WorkOfferResponse";

type WorkOfferCategoryContainerProps = {
  workOfferCategory: WorkOfferCategoryResponse;
  workOffers: WorkOfferResponse[] | undefined;
  totalServices: number;
  pageChangeCallback: (page: number) => void;
};

export function WorkOfferCategoryContainer({
  workOfferCategory,
  workOffers,
  totalServices,
  pageChangeCallback,
}: WorkOfferCategoryContainerProps) {
  const [page, setPage] = useState<number>(0);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

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
                      <IconButton
                        icon={<Icon type="pencil" />}
                        onClick={() => {}}
                        label="Edit"
                        className="text-gray-600"
                      />
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
                      navigate(`/marketplace/${workOffer.id}`)
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
                  clickCallback={() => console.log("new service!")}
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
                >
                  {() => null}
                </Pagination>
              </div>
            </Card.Footer>
          </Card>
        )}
      </div>
    </>
  );
}

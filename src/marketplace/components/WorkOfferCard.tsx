import { Card, Link, Typography } from "@tiller-ds/core";

import { WorkOfferResponse } from "../api/WorkOfferResponse";

type WorkOfferCardProps = {
  workOffer: WorkOfferResponse;
};

export function WorkOfferCard({ workOffer }: WorkOfferCardProps) {
  return (
    <Link to={`/marketplace/${workOffer.workOfferCategoryId}/${workOffer.id}`}>
      <Card className="cursor-pointer">
        <Card.Body>
          <div className="flex flex-row justify-between">
            <Typography variant="text" element="p">
              {workOffer.title}
            </Typography>
            <Typography variant="text" element="p">
              {`Price: ${workOffer.pricePerHour} ${workOffer.currencySymbol} / h`}
            </Typography>
            <div className="flex flex-row gap-x-1">
              <Typography variant="subtext" element="p">
                by
              </Typography>
              <Link to={`/profile/${workOffer.author.id}`}>
                <Typography variant="text" element="p">
                  {workOffer.author.username}
                </Typography>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

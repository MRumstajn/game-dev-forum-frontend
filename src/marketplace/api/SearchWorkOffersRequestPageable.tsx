import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchWorkOffersRequestPageable = {
  title?: string;

  pricePerHourFromIncluding?: number;

  pricePerHourToIncluding?: number;

  authorUsername?: string;

  workOfferCategoryId?: number;
} & PageableRequest;

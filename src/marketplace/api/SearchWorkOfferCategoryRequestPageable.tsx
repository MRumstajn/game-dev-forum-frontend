import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchWorkOfferCategoryRequestPageable = {
  id?: number;
  title?: string;
} & PageableRequest;

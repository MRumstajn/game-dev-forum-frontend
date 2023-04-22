import { UserResponse } from "../../common/api/UserResponse";

export type WorkOfferResponse = {
  id: number;

  title: string;

  description: string;

  pricePerHour: number;

  author: UserResponse;

  currencySymbol: string;

  workOfferCategoryId: number;
};

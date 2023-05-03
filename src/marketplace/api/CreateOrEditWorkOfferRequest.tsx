export type CreateOrEditWorkOfferRequest = {
  title: string;

  description: string;

  pricePerHour: number;

  currencySymbol: string;

  workOfferCategoryId: number;
};

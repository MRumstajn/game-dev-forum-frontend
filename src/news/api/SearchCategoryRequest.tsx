import { PageableRequest } from "../../common/api/PageableRequest";

export type SearchCategoryRequest = {
  sectionId?: number;

  title?: string;
} & PageableRequest;

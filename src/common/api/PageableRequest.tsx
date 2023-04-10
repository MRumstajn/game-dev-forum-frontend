export type PageableRequest = {
  pageSize?: number;

  pageNumber?: number;

  sortPropertyList?: { property: string; direction: "ASC" | "DESC" }[];
};

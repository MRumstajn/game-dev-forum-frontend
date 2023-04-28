export type PageResponseWrapper<T> = {
  content: T[];

  totalElements: number;

  totalPages: number;

  pageNumber: number;

  pageSize: number;
};

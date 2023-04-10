export type PageResponseWrapper<T> = {
  content: T[];

  totalElements: number;

  pageNumber: number;

  pageSize: number;
};

export type StatusWrappedResponse<T> = {
  status: number;

  isOk: boolean;

  data: T;
};

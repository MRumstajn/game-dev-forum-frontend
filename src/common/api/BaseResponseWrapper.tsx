import { ErrorCode } from "./ErrorCode";

export type BaseResponseWrapper<T> = {
  status: number;

  isOk: boolean;

  data: T;

  errorCode: ErrorCode;

  errorMessage: string;
};

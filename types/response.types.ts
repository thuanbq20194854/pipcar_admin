export const ErrorCode = {
  BadRequest: -600,
  NotAuthenticateError: -601,
  DataNotFound: -602,
  NotAuthorizedError: -603,
  DatabaseConnectionError: -604,
  RequestValidationError: -605,
  NotFoundError: -606,
  PipTokenExpiredError: -607,
  PipJsonWebTokenError: -608,
  PipTokenNotBeforeError: -609,
  PermissionDeniedError: -610,
};
type TErrorCode = typeof ErrorCode;
export type TErrorResponse = {
  response_code: TErrorCode[keyof TErrorCode];
  error: { message: string; field?: string }[];
};

export type TResponse<TData = undefined> = {
  status: number;
  message: string;
  data: TData;
};

export type TMetaBase = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponseWithMeta<TData extends any> = {
  status: number;
  message: string;
  data?: TData & { meta_data: TMetaBase };
};

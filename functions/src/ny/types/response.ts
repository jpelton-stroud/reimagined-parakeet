interface Meta {
  success: boolean;
  message: string;
  responseType: string;
}

interface Success<T> extends Meta {
  result: T;
  total?: number;
  offsetStart?: number;
  offsetEnd?: number;
  limit: number;
}

interface Failure extends Meta {
  errorCode: number;
}

export type Response<T> = Success<T> | Failure;
export function isSuccess<T>(o: Response<T>): o is Success<T> {
  return o.success;
}

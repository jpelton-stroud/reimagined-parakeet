import { Items } from './shared';

interface Meta {
  success: boolean;
  message: string;
  responseType: string;
}

interface Success<T> extends Meta {
  result: T | Items<T>;
  total?: number;
  offsetStart?: number;
  offsetEnd?: number;
  limit: number;
}

interface Failure extends Meta {
  errorCode: number;
}

export type Response<T = unknown> = Success<T> | Failure;
export function isSuccess(o: unknown): o is Success<unknown> {
  return (o as Response).success === true;
}

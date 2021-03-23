import { isItemsList, Items } from './shared';
interface CommonFields {
  success: boolean;
  message: string;
  responseType: string;
}

interface Success<T> extends CommonFields {
  result: T;
  total?: number;
  offsetStart?: number;
  offsetEnd?: number;
  limit: number;
}

interface Failure extends CommonFields {
  errorCode: number;
}

export type Response<T> = Success<T> | Failure;

function isSuccess<T>(o: Response<T>): o is Success<T> {
  return o.success;
}

// Validate & unpack API response
export function unpack<T>(o: Response<T>): T {
  if (!isSuccess(o)) throw new Error(`Error ${o.errorCode}: ${o.message}`);
  else return isItemsList(o.result) ? o.result.items : o.result;
}

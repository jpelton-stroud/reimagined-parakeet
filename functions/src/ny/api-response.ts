export interface Response {
  success: boolean;
  message: string;
  responseType: string;
  result: {};
}

export interface ListResponse extends Response {
  total: number;
  offsetStart: number;
  offsetEnd: number;
  limit: number;
  result: {
    items: [];
    size: number;
  };
}

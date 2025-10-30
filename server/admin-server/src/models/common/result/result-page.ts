export class ResultPage<T> {
  code: number;
  msg: string;
  message: string;
  data?: T[];
  total: number;
  page: number;
  limit: number;

  constructor(
    code: number,
    msg: string,
    message: string,
    total: number,
    page: number,
    limit: number,
    data?: T[],
  ) {
    this.code = code;
    this.msg = msg;
    this.message = message;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}

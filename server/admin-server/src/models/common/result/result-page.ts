export class ResultPage<T> {
  data?: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;

  constructor(
    total: number,
    page: number,
    limit: number,
    data?: T[],
    hasNext?: boolean,
    hasPrev?: boolean,
  ) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
    this.hasNext = hasNext ?? page < Math.ceil(total / limit);
    this.hasPrev = hasPrev ?? page > 1;
  }
}

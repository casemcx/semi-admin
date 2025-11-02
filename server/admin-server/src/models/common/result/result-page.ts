export class ResultPage<T> {
  records?: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;

  constructor(
    total: number,
    page: number,
    limit: number,
    records?: T[],
    hasNext?: boolean,
    hasPrev?: boolean,
  ) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.records = records;
    this.hasNext = hasNext ?? page < Math.ceil(total / limit);
    this.hasPrev = hasPrev ?? page > 1;
  }
}

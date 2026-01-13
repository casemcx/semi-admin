import type { ProTableProps } from '@packages/components';
import type { QueryPage, QueryPageResult, ResultData } from '@packages/share';

export type Entity = Record<string, any>;

export type TableStateOptions<T extends Entity = Entity> = ProTableProps<T> & {
  request: (query: QueryPage<T>) => Promise<ResultData<QueryPageResult<T>>>;
};

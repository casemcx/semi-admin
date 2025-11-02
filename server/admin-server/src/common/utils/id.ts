import { SnowflakeIdv1 } from 'simple-flakeid';

const snowflake = new SnowflakeIdv1({
  workerId: 1,
});

export function guid() {
  return snowflake.NextBigId();
}

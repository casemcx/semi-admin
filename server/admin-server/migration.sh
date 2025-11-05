#!/bin/bash
# 生成数据库迁移文件

ACTION=$1
FILE_NAME=${2:-migration}
TS_NODE_COMMAND="bun -r tsconfig-paths/register \
    --transpile-only ./node_modules/typeorm/cli.js \
    -d ./src/config/db.ts \
    migration:$ACTION"

if [ "$ACTION" == "generate" ]; then
  $TS_NODE_COMMAND ./migrations/$FILE_NAME
  # 格式化生成文件
  npm run format:migrations
else
  $TS_NODE_COMMAND
fi

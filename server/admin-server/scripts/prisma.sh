#!/bin/bash

# Prisma 管理脚本
# 使用方法: ./prisma.sh [command] [options]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

# 显示使用帮助
show_help() {
    echo -e "${CYAN}Prisma 管理脚本使用说明${NC}"
    echo ""
    echo "使用方法:"
    echo "  ./prisma.sh [command] [options]"
    echo ""
    echo "可用命令:"
    echo ""
    echo "  ${GREEN}dev${NC}                     启动 Prisma 开发服务器"
    echo "  ${GREEN}migrate <name>${NC}          创建并执行数据库迁移"
    echo "  ${GREEN}push${NC}                    直接推送 schema 到数据库（无迁移文件）"
    echo "  ${GREEN}generate${NC}                生成 Prisma Client"
    echo "  ${GREEN}studio${NC}                  打开 Prisma Studio（数据库可视化工具）"
    echo "  ${GREEN}status${NC}                  查看迁移状态"
    echo "  ${GREEN}reset${NC}                   重置数据库（⚠️  会删除所有数据）"
    echo "  ${GREEN}seed${NC}                    执行种子数据脚本"
    echo "  ${GREEN}diff${NC}                    显示 schema 和数据库的差异"
    echo "  ${GREEN}deploy${NC}                  部署迁移（生产环境使用）"
    echo "  ${GREEN}docker${NC}                  启动 Docker PostgreSQL"
    echo "  ${GREEN}init${NC}                    初始化项目（安装依赖 + 生成客户端）"
    echo ""
    echo "示例:"
    echo "  ./prisma.sh dev                      # 启动开发服务器"
    echo "  ./prisma.sh migrate add-user-field  # 创建迁移"
    echo "  ./prisma.sh push                    # 推送 schema"
    echo "  ./prisma.sh studio                  # 打开可视化工具"
    echo ""
    echo "环境要求:"
    echo "  - Node.js >= 16"
    echo "  - PostgreSQL 或其他支持的数据库"
    echo "  - Docker (可选，用于 PostgreSQL)"
}

# 检查是否安装了必要的依赖
check_dependencies() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi

    if ! command -v npx &> /dev/null; then
        print_error "npx 未找到，请确保 Node.js 已正确安装"
        exit 1
    fi

    # 检查 prisma 是否安装
    if [ ! -d "node_modules/@prisma/client" ] || [ ! -d "node_modules/prisma" ]; then
        print_warning "Prisma 未安装，正在安装..."
        npm install prisma @prisma/client
        print_success "Prisma 安装完成"
    fi
}

# 启动 Prisma 开发服务器
cmd_dev() {
    print_header "启动 Prisma 开发服务器"
    check_dependencies
    npx prisma dev
}

# 创建迁移
cmd_migrate() {
    local name=$1
    if [ -z "$name" ]; then
        print_error "请提供迁移名称"
        echo "使用方法: ./prisma.sh migrate <migration-name>"
        echo "示例: ./prisma.sh migrate add-user-avatar"
        exit 1
    fi

    print_header "创建并执行迁移: $name"
    check_dependencies
    npx prisma migrate dev --name "$name"
    print_success "迁移 '$name' 创建并执行成功"
}

# 推送 schema 到数据库
cmd_push() {
    print_header "推送 Schema 到数据库"
    check_dependencies

    # 检查是否是强制推送
    if [ "$1" = "--force-reset" ]; then
        print_warning "⚠️  这将重置数据库并删除所有数据！"
        read -p "确定继续吗？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npx prisma db push --force-reset
        else
            print_info "操作已取消"
            exit 0
        fi
    else
        npx prisma db push
    fi

    print_success "Schema 推送成功"
}

# 生成 Prisma Client
cmd_generate() {
    print_header "生成 Prisma Client"
    check_dependencies
    npx prisma generate
    print_success "Prisma Client 生成成功"
}

# 打开 Prisma Studio
cmd_studio() {
    print_header "启动 Prisma Studio"
    check_dependencies
    print_info "Prisma Studio 将在浏览器中打开"
    npx prisma studio
}

# 查看迁移状态
cmd_status() {
    print_header "迁移状态"
    check_dependencies
    npx prisma migrate status
}

# 重置数据库
cmd_reset() {
    print_header "重置数据库"
    print_warning "⚠️  这将删除所有数据并重新应用所有迁移！"
    read -p "确定继续吗？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        check_dependencies
        npx prisma migrate reset
        print_success "数据库重置成功"
    else
        print_info "操作已取消"
        exit 0
    fi
}

# 执行种子数据
cmd_seed() {
    print_header "执行种子数据"
    check_dependencies

    if [ -f "prisma/seed.ts" ]; then
        npx tsx prisma/seed.ts
    elif [ -f "prisma/seed.js" ]; then
        node prisma/seed.js
    else
        print_warning "未找到种子数据文件 (prisma/seed.ts 或 prisma/seed.js)"
        print_info "创建示例种子文件..."
        cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('开始执行种子数据...');

  // 示例：创建管理员用户
  // const admin = await prisma.user.upsert({
  //   where: { username: 'admin' },
  //   update: {},
  //   create: {
  //     username: 'admin',
  //     email: 'admin@example.com',
  //     password: '$2b$10$...', // 加密后的密码
  //   },
  // });

  console.log('种子数据执行完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF
        print_success "种子文件已创建: prisma/seed.ts"
    fi
}

# 显示差异
cmd_diff() {
    print_header "Schema 与数据库差异"
    check_dependencies
    npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource postgresql
}

# 部署迁移
cmd_deploy() {
    print_header "部署迁移"
    check_dependencies
    npx prisma migrate deploy
    print_success "迁移部署成功"
}

# 启动 Docker PostgreSQL
cmd_docker() {
    print_header "启动 Docker PostgreSQL"

    if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if [ -f "docker/docker-compose.dev.yml" ]; then
        docker-compose -f docker/docker-compose.dev.yml up -d postgres
        print_success "PostgreSQL 容器已启动"
        print_info "连接信息:"
        print_info "  Host: localhost"
        print_info "  Port: 5432"
        print_info "  Database: admin_server_dev"
        print_info "  Username: postgres"
        print_info "  Password: postgres123"
    else
        print_error "未找到 docker-compose.dev.yml 文件"
        exit 1
    fi
}

# 初始化项目
cmd_init() {
    print_header "初始化 Prisma 项目"

    # 安装依赖
    print_info "安装 Prisma 依赖..."
    pnpm install prisma @prisma/client

    # 生成客户端
    cmd_generate

    print_success "Prisma 项目初始化完成"
    print_info "下一步："
    print_info "  1. 启动数据库: ./prisma.sh docker"
    print_info "  2. 推送 schema: ./prisma.sh push"
    print_info "  3. 查看数据: ./prisma.sh studio"
}

# 主函数
main() {
    case "${1:-}" in
        "dev")
            cmd_dev
            ;;
        "migrate")
            cmd_migrate "$2"
            ;;
        "push")
            cmd_push "$2"
            ;;
        "generate")
            cmd_generate
            ;;
        "studio")
            cmd_studio
            ;;
        "status")
            cmd_status
            ;;
        "reset")
            cmd_reset
            ;;
        "seed")
            cmd_seed
            ;;
        "diff")
            cmd_diff
            ;;
        "deploy")
            cmd_deploy
            ;;
        "docker")
            cmd_docker
            ;;
        "init")
            cmd_init
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"

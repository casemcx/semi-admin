import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762327743905 implements MigrationInterface {
  name = 'Migration1762327743905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" SERIAL NOT NULL, "status" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(50) NOT NULL, "code" character varying(100) NOT NULL, "type" integer NOT NULL, "path" character varying(255), "component" character varying(255), "icon" character varying(100), "method" character varying(10), "apiPath" character varying(255), "sort" integer NOT NULL DEFAULT '0', "description" character varying(255), CONSTRAINT "UQ_30e166e8c6359970755c5727a23" UNIQUE ("code"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")); COMMENT ON COLUMN "permission"."status" IS '状态, 0: 删除，1: 正常'; COMMENT ON COLUMN "permission"."created_at" IS '创建时间'; COMMENT ON COLUMN "permission"."updated_at" IS '更新时间'; COMMENT ON COLUMN "permission"."deleted_at" IS '删除时间'; COMMENT ON COLUMN "permission"."name" IS '权限名称'; COMMENT ON COLUMN "permission"."code" IS '权限编码'; COMMENT ON COLUMN "permission"."type" IS '权限类型：1-菜单 2-按钮 3-接口'; COMMENT ON COLUMN "permission"."path" IS '路由路径'; COMMENT ON COLUMN "permission"."component" IS '组件路径'; COMMENT ON COLUMN "permission"."icon" IS '图标'; COMMENT ON COLUMN "permission"."method" IS '请求方法'; COMMENT ON COLUMN "permission"."apiPath" IS 'API路径'; COMMENT ON COLUMN "permission"."sort" IS '排序值'; COMMENT ON COLUMN "permission"."description" IS '权限描述'`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_permission_sort" ON "permission" ("sort") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_permission_status" ON "permission" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_permission_type" ON "permission" ("type") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_permission_type"`);
    await queryRunner.query(`DROP INDEX "public"."idx_permission_status"`);
    await queryRunner.query(`DROP INDEX "public"."idx_permission_sort"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}

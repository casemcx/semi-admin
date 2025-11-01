-- CreateTable
CREATE TABLE "permission" (
    "id" BIGSERIAL NOT NULL,
    "parent_id" BIGINT NOT NULL DEFAULT 0,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "type" INTEGER NOT NULL,
    "path" VARCHAR(255),
    "component" VARCHAR(255),
    "icon" VARCHAR(100),
    "method" VARCHAR(10),
    "api_path" VARCHAR(255),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "is_system" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_code_key" ON "permission"("code");

-- CreateIndex
CREATE INDEX "permission_parent_id_idx" ON "permission"("parent_id");

-- CreateIndex
CREATE INDEX "permission_type_idx" ON "permission"("type");

-- CreateIndex
CREATE INDEX "permission_status_idx" ON "permission"("status");

-- CreateIndex
CREATE INDEX "permission_sort_idx" ON "permission"("sort");

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

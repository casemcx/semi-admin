-- CreateTable
CREATE TABLE "permission" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "type" INTEGER NOT NULL,
    "path" VARCHAR(255),
    "component" VARCHAR(255),
    "icon" VARCHAR(100),
    "method" VARCHAR(10),
    "apiPath" VARCHAR(255),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_code_key" ON "permission"("code");

-- CreateIndex
CREATE INDEX "permission_type_idx" ON "permission"("type");

-- CreateIndex
CREATE INDEX "permission_status_idx" ON "permission"("status");

-- CreateIndex
CREATE INDEX "permission_sort_idx" ON "permission"("sort");

-- CreateIndex
CREATE INDEX "permission_code_idx" ON "permission"("code");

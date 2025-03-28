-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "package" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "placedDate" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "student_id_key" ON "student"("id");

-- CreateIndex
CREATE UNIQUE INDEX "student_regNo_company_package_placedDate_key" ON "student"("regNo", "company", "package", "placedDate");

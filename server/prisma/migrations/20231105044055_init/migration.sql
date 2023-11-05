-- CreateTable
CREATE TABLE "UberUser" (
    "id" SERIAL NOT NULL,
    "uberId" TEXT NOT NULL,
    "uberAccessToken" TEXT NOT NULL,
    "uberRefreshToken" TEXT NOT NULL,

    CONSTRAINT "UberUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UberUser_uberId_key" ON "UberUser"("uberId");

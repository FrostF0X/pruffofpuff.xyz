-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "dynamicUserId" TEXT,
    "partnerName" TEXT NOT NULL,
    "puffs" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "telegramUsername" TEXT,
    "telegramImageUrl" TEXT,
    "farcaster" TEXT,
    "github" TEXT,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "jobTitle" TEXT,
    "tshirtSize" TEXT,
    "ownerAddress" TEXT,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFT_identifier_key" ON "NFT"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_dynamicUserId_key" ON "NFT"("dynamicUserId");

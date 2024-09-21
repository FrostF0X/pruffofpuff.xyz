-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "puffs" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "discord" TEXT,
    "telegram" TEXT,
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

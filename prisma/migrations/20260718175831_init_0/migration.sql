-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'COMPLETED', 'DISPUTED', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('HELD', 'RELEASED', 'DISPUTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "TrustFund" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalAmount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "beneficiary" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "proofHash" TEXT,
    "amountToRelease" DECIMAL(20,2) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "status" "EscrowStatus" NOT NULL DEFAULT 'HELD',
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "reportedBy" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrustFund_beneficiary_idx" ON "TrustFund"("beneficiary");

-- CreateIndex
CREATE INDEX "TrustFund_contractAddress_idx" ON "TrustFund"("contractAddress");

-- CreateIndex
CREATE INDEX "Milestone_fundId_idx" ON "Milestone"("fundId");

-- CreateIndex
CREATE INDEX "Escrow_fundId_idx" ON "Escrow"("fundId");

-- CreateIndex
CREATE INDEX "Dispute_fundId_idx" ON "Dispute"("fundId");

-- CreateIndex
CREATE INDEX "Dispute_reportedBy_idx" ON "Dispute"("reportedBy");

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "TrustFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Escrow" ADD CONSTRAINT "Escrow_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "TrustFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "TrustFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

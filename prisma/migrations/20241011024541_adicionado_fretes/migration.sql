-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "waybills" ADD COLUMN     "destination" TEXT,
ADD COLUMN     "nfe" TEXT,
ADD COLUMN     "total_cte" DOUBLE PRECISION,
ADD COLUMN     "value_cte" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "freight_receivables" (
    "id" SERIAL NOT NULL,
    "waybill_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freight_receivables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight_payables" (
    "id" SERIAL NOT NULL,
    "waybill_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freight_payables_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "freight_receivables" ADD CONSTRAINT "freight_receivables_waybill_id_fkey" FOREIGN KEY ("waybill_id") REFERENCES "waybills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freight_payables" ADD CONSTRAINT "freight_payables_waybill_id_fkey" FOREIGN KEY ("waybill_id") REFERENCES "waybills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

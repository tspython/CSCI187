-- CreateTable
CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "service_provider" TEXT NOT NULL,
    "pickup_latitude" DOUBLE PRECISION,
    "pickup_longitude" DOUBLE PRECISION,
    "dropoff_latitude" DOUBLE PRECISION,
    "dropoff_longitude" DOUBLE PRECISION,
    "duration" INTEGER,
    "distance" DOUBLE PRECISION,
    "cost_estimate" DOUBLE PRECISION,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "user_id" INTEGER,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

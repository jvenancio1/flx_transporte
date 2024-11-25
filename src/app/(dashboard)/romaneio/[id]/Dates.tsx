"use client";

import CreatedUpdated from "@/app/components/CreatedUpdated";
import { trpc } from "@/utils/trpc";

export type DatesProps = { id: number };

export default function Dates({ id }: DatesProps) {
  const { data: courseInfo } = trpc.waybill.get.useQuery(id);

  return <CreatedUpdated {...courseInfo} />;
}

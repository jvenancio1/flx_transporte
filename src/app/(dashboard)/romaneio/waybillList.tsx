"use client";

import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/utils/trpc";
import { keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GenericTable from "../../components/GenericTable";

export default function WaybillList({}) {
  const router = useRouter();
  const [cursor, setCursor] = useState<number>();
  const [licence, setLicence] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [id, setId] = useState("");
  const query = trpc.waybill.getMany.useQuery(
    { cursor, id, licence, name, destination },
    { placeholderData: keepPreviousData },
  );
  const { nextPage, previousPage, viewedCount } = usePagination(
    query.data,
    setCursor,
  );

  const { data: totalCount } = trpc.waybill.count.useQuery();

  return (
    <GenericTable
      nextPage={nextPage}
      previousPage={previousPage}
      result={query}
      rows={[
        {
          title: "Nº do processo",
          value: "id",
          filter: {
            type: "string",
            value: id,
            onChange: setId,
            placeholder: "Numero do processo",
          },
        },
        {
          title: "Destino",
          value: "destination",
          filter: {
            type: "string",
            value: destination,
            onChange: setDestination,
            placeholder: "Destino do frete",
          },
        },
        {
          title: "Placa",
          value: "license_plate",
          filter: {
            type: "string",
            value: licence,
            onChange: setLicence,
            placeholder: "Placa do cavalo",
          },
        },
        {
          title: "Motorista",
          value: ({ driver }) =>
            driver ? driver.name : "Motorista não informado",
          filter: {
            type: "string",
            value: name,
            onChange: setName,
            placeholder: "Nome do motorista",
          },
        },
        {
          title: "Criado por",
          value: ({ user }) => user.name,
          filter: {
            type: "string",
            value: nameUser,
            onChange: setNameUser,
            placeholder: "Criado por",
          },
        },
        {
          title: "Data de criação",
          value: "created_at",
        },
        {
          title: "Ultima atualização",
          value: "updated_at",
        },
      ]}
      total={totalCount}
      viewedCount={viewedCount}
      onClickRow={(row) => router.push(`/romaneio/${row.id}`)}
    />
  );
}

"use client";

import Input from "@/app/components/Admin/Form/Input";
import ErrorMessage from "@/app/components/ErrorMessage";
import { formatToCurrency } from "@/utils/formatValue";
import { RouterOutputs, trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt } from "react-icons/fa";
import z from "zod";

export type PropertiesProps = {
  id: number;
};

const schema = z.object({
  license_plate: z.string().optional(),
  nfe: z.string().optional(),
  client: z.string().optional(),
  destination: z.string().optional(),
  driver_name: z.string().optional(),
  driver_cpf: z.string().optional(),
  weight: z.number().optional(),
  value_cte: z.number().optional(),
  total_cte: z.number().optional(),
});

type processDataProps = RouterOutputs["waybill"]["get"];

type FormValues = z.infer<typeof schema>;

export default function Properties({ id }: PropertiesProps) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: processData } = trpc.waybill.get.useQuery(id);

  if (processData == null) return <ErrorMessage />;

  const { mutateAsync } = trpc.waybill.update.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Processo atualizado com sucesso",
        colorScheme: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      router.replace(`/romaneio/${res}`);
      setIsEditing(false);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        colorScheme: "red",
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync({
      data: {
        ...values,
      },
      id: id,
    });
  };

  return (
    <Box p={5} bg="white" borderRadius={"lg"} mb={3}>
      <Heading mb={3} size={"md"}>
        Informação do processo
        <IconButton
          variant={"ghost"}
          colorScheme="gray"
          aria-label="edit"
          icon={<FaPencilAlt />}
          onClick={() => setIsEditing(true)}
          isDisabled={isEditing}
        />
      </Heading>

      <Form
        onSubmit={onSubmit}
        isEditing={isEditing}
        processData={processData}
        onCancel={() => setIsEditing(false)}
        values={{
          ...processData,
          destination: processData.destination ?? "",
          license_plate: processData.license_plate ?? "",
          nfe: processData.nfe ?? "",
          weight: processData.weight ?? undefined,
          value_cte: processData.value_cte ?? undefined,
          total_cte: processData.total_cte ?? undefined,
          driver_name: processData.driver?.name ?? "",
          driver_cpf: processData.driver?.cpf ?? "",
          client: processData.client ?? "",
        }}
      />
    </Box>
  );
}

type FormProps = {
  values: FormValues;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel?: () => void;
  processData: processDataProps;
  isEditing?: boolean;
};

function Form({
  values,
  onSubmit,
  isEditing,
  onCancel,
  processData,
}: FormProps) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gap={3} templateColumns={"repeat(3, 1fr)"} mb={3}>
        <GridItem colSpan={1}>
          <Text fontWeight={"semibold"} mb={3}>
            Criado por
          </Text>
          <Box>{processData.user.name || ""}</Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("license_plate")}
            label={"Placa do Veículo"}
            isReadOnly={!isEditing}
            error={errors.license_plate?.message}
            defaultValue={values.license_plate}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("destination")}
            label={"Destino"}
            isReadOnly={!isEditing}
            error={errors.destination?.message}
            defaultValue={values.destination}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("driver_name")}
            label={"Nome do Motorista"}
            isReadOnly={!isEditing}
            error={errors.driver_name?.message}
            defaultValue={processData.driver?.name || ""}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("driver_cpf")}
            label={"CPF do Motorista"}
            isReadOnly={!isEditing}
            error={errors.driver_cpf?.message}
            defaultValue={processData.driver?.cpf || ""}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("weight")}
            label={"Peso"}
            isReadOnly={!isEditing}
            error={errors.weight?.message}
            defaultValue={values.weight}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("nfe")}
            label={"Nota Fiscal (NFE)"}
            isReadOnly={!isEditing}
            error={errors.nfe?.message}
            defaultValue={values.nfe}
          />
        </GridItem>
        <GridItem colSpan={1}>
          {!isEditing ? (
            <>
              <Text fontWeight={"semibold"} mb={3}>
                Valor CTE
              </Text>
              <Box>{formatToCurrency(values.value_cte || 0)}</Box>
            </>
          ) : (
            <Input
              {...register("value_cte")}
              label={"Valor do CTE"}
              isReadOnly={!isEditing}
              error={errors.value_cte?.message}
              defaultValue={values.value_cte}
            />
          )}
        </GridItem>

        <GridItem colSpan={1}>
          {!isEditing ? (
            <>
              <Text fontWeight={"semibold"} mb={3}>
                Total CTE
              </Text>
              <Box>{formatToCurrency(values.total_cte || 0)}</Box>
            </>
          ) : (
            <Input
              {...register("total_cte")}
              label={"Total de CTE"}
              isReadOnly={!isEditing}
              error={errors.total_cte?.message}
              defaultValue={values.total_cte}
            />
          )}
        </GridItem>
      </Grid>

      {isEditing ? (
        <ButtonGroup variant={"solid"}>
          <Button
            colorScheme="gray"
            aria-label="cancel"
            type="button"
            onClick={() => {
              reset();
              onCancel?.();
            }}
          >
            Cancelar
          </Button>
          <Button colorScheme="green" aria-label="confirm" type="submit">
            Salvar
          </Button>
        </ButtonGroup>
      ) : null}
    </form>
  );
}

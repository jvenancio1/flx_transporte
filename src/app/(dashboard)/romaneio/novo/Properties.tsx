"use client";

import Input from "@/app/components/Admin/Form/Input";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  license_plate: z.string(),
  nfe: z.string(),
  destination: z.string(),
  driver_name: z.string(),
  driver_cpf: z.string(),
  weight: z.string(),
  value_cte: z.string(),
  client: z.string(),
});

type FormValues = z.infer<typeof schema>;

export default function Properties({ userEmail }: { userEmail: string }) {
  const toast = useToast();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { mutateAsync, isPending } = trpc.waybill.create.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Processo criado com sucesso",
        colorScheme: "green",
      });
      utils.users.getMany.invalidate();
      router.replace(`/romaneio/${res.id}`);
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
      ...values,
      userEmail: userEmail,
    });
  };

  return (
    <Box p={5} bg="white" borderRadius={"lg"}>
      <Heading mb={3} size={"md"}>
        Informe os dados do novo processo
      </Heading>
      <Form
        isLoading={isPending}
        onSubmit={onSubmit}
        defaultValues={{
          license_plate: "",
          nfe: "",
          destination: "",
          weight: "",
          value_cte: "",
          driver_name: "",
          driver_cpf: "",
          client: "",
        }}
      />
    </Box>
  );
}

type FormProps = {
  defaultValues: FormValues;
  isLoading?: boolean;
  onSubmit: (values: FormValues) => Promise<void> | void;
};

function Form({ defaultValues, onSubmit, isLoading }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gap={3} templateColumns={"repeat(4, 1fr)"} mb={3}>
        <GridItem colSpan={2}>
          <Input
            {...register("client")}
            label="Cliente"
            placeholder="Nome do cliente"
            error={errors.client?.message}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            {...register("destination")}
            label={"Destino"}
            placeholder="Destino"
            error={errors.destination?.message}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            {...register("driver_cpf")}
            label="CPF do motorista"
            placeholder="CPF do motorista"
            error={errors.driver_cpf?.message}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            {...register("driver_name")}
            label="Nome do motorista"
            placeholder="Nome do motorista"
            error={errors.driver_name?.message}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            {...register("nfe")}
            label
            placeholder="NFE"
            error={errors.nfe?.message}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("license_plate")}
            label="Placa do cavalo"
            placeholder="Placa do cavalo"
            error={errors.driver_name?.message}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <Input
            {...register("weight")}
            label="Peso"
            placeholder="Peso"
            error={errors.weight?.message}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            {...register("value_cte")}
            label="Valor CTE"
            placeholder="Valor CTE"
            error={errors.value_cte?.message}
          />
        </GridItem>
      </Grid>
      <Button
        isLoading={isLoading}
        colorScheme="green"
        aria-label="confirm"
        type="submit"
      >
        Salvar
      </Button>
    </form>
  );
}

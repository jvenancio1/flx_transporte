"use client";

import Input from "@/app/components/Admin/Form/Input";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string(),
  status: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function Properties({}) {
  const toast = useToast();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { mutateAsync, isPending } = trpc.users.create.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Usuário criado com sucesso",
        colorScheme: "green",
      });
      utils.users.getMany.invalidate();
      router.replace(`/usuarios/${res.id}`);
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
    });
  };

  return (
    <Box p={5} bg="white" borderRadius={"lg"}>
      <Heading mb={3} size={"md"}>
        Informe os dados do usuário
      </Heading>
      <Form
        isLoading={isPending}
        onSubmit={onSubmit}
        defaultValues={{
          email: "",
          name: "",
          password: "",
          status: true,
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
            {...register("name")}
            label
            placeholder="Nome completo"
            error={errors.name?.message}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            {...register("email")}
            label
            placeholder="E-mail"
            error={errors.email?.message}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            {...register("password")}
            label
            type="password"
            error={errors.password?.message}
          />
        </GridItem>
        <GridItem colSpan={2} alignItems={"center"}>
          <HStack alignItems={"center"}>
            <Text>Ativo?</Text>
            <Switch size="lg" {...register("status")}></Switch>
          </HStack>
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

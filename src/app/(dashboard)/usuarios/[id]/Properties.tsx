"use client";

import Input from "@/app/components/Admin/Form/Input";
import ErrorMessage from "@/app/components/ErrorMessage";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Heading,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt } from "react-icons/fa";
import z from "zod";

export type PropertiesProps = {
  userId: number;
};

const schema = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
  role: z.string(),
  status: z.boolean(),
});

type UserDataProps = User;

type FormValues = z.infer<typeof schema>;

export default function Properties({ userId }: PropertiesProps) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: userData } = trpc.users.get.useQuery(userId);

  const { mutateAsync } = trpc.users.update.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success",
        description: "Category was successfully updated",
        colorScheme: "green",
      });
      router.replace(`/usuarios/${res.id}`);
      utils.users.getMany.invalidate();
      utils.users.get.invalidate(res.id);
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

  if (userData == null) return <ErrorMessage />;
  const onSubmit = async (values: FormValues) => {
    await mutateAsync({
      data: {
        ...values,
      },
      id: userId,
    });
  };

  return (
    <Box p={5} bg="white" borderRadius={"lg"} mb={3}>
      <Heading mb={3} size={"md"}>
        Detalhes usuário
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
        userData={userData}
        onCancel={() => setIsEditing(false)}
        values={{
          ...userData,
          password: "",
        }}
      />
    </Box>
  );
}

type FormProps = {
  values: FormValues;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel?: () => void;
  userData: UserDataProps;
  isEditing?: boolean;
};

function Form({ values, onSubmit, isEditing, onCancel }: FormProps) {
  const {
    register,
    reset,
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
          <Input
            {...register("name")}
            label={"Nome"}
            isReadOnly={!isEditing}
            error={errors.name?.message}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("email")}
            label={"E-mail"}
            isReadOnly={!isEditing}
            error={errors.email?.message}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Input
            {...register("password")}
            label={"Alterar senha"}
            isReadOnly={!isEditing}
            error={errors.role?.message}
          />
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
            Cancel
          </Button>
          <Button colorScheme="green" aria-label="confirm" type="submit">
            Save
          </Button>
        </ButtonGroup>
      ) : null}
    </form>
  );
}

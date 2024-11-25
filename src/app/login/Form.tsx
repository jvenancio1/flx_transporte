"use client";

import Logo from "@/assets/logo.png";
import { Box, Button, Img, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/Admin/Form/Input";

type Values = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues: { email: "", password: "" } });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: Values) => {
    setLoading(true);
    const resp = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/romaneio",
    });

    if (resp == null) {
      setLoading(false);
      throw new Error("Unexpected error: signIn returned undefined");
    }

    if (resp.ok) {
      setLoading(false);
      resp.url && router.push(resp.url);
    }

    if (resp === undefined) {
      setLoading(false);
      setError("root", { message: "ocorreu um erro inesperado" });
    }

    switch (resp.error) {
      case "Invalid password":
        setLoading(false);
        setError("password", { message: "Senha incorreta" });
        break;
      case "Invalid email":
        setLoading(false);
        setError("email", { message: "E-mail não cadastrado" });
        break;
    }
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      textAlign="center"
      width="100%"
      maxW="400px"
      gap={4}
      p={8}
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <Img src={Logo.src} marginBottom={8} maxW="60%" />
      <form onSubmit={handleSubmit(handleLogin)}>
        <Input type="text" placeholder="E-mail" mb={4} {...register("email")} />
        <Input type="password" placeholder="Senha" {...register("password")} />
        <Button
          type="submit"
          bgColor="flx.500"
          color={"white"}
          isLoading={loading}
          width="100%"
          mt={4}
        >
          Entrar
        </Button>
      </form>

      {errors.password && (
        <Text color={"red.500"}>E-mail ou senha inválido</Text>
      )}
      {errors.email && <Text color={"red.500"}>E-mail ou senha inválido</Text>}
      {errors.root && (
        <Text className="text-red-500">{errors.root.message}</Text>
      )}
    </Box>
  );
}

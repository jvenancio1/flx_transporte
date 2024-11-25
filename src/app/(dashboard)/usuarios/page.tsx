import { proxyClient } from "@/utils/trpcProxyClient";
import { Box, Container, Heading, HStack, IconButton } from "@chakra-ui/react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import NextLink from "next/link";
import { FaPlus } from "react-icons/fa";
import UsersList from "./UserList";

export default async function Users() {
  const helpers = createServerSideHelpers({ client: proxyClient });
  await helpers.users.getMany.prefetch({ cursor: undefined });
  await helpers.users.count.prefetch();

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <Container maxW="container.xl">
        <Box p={5} bg="white" borderRadius={"lg"} my={3}>
          <HStack spacing={5} mb={3} justify={"space-between"}>
            <Heading size={"md"} mb={3}>
              Usuários
            </Heading>
            <IconButton
              size={"sm"}
              as={NextLink}
              href={`/usuarios/novo`}
              aria-label="Cadastrar usuário"
              icon={<FaPlus />}
              colorScheme="green"
            />
          </HStack>
          <UsersList />
        </Box>
      </Container>
    </HydrationBoundary>
  );
}

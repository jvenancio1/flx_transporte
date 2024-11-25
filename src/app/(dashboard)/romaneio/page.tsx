import { Box, Container, HStack, Heading, IconButton } from "@chakra-ui/react";
import { HydrationBoundary } from "@tanstack/react-query";
import NextLink from "next/link";
import { FaPlus } from "react-icons/fa";
import WaybillList from "./waybillList";

export default async function Page() {
  return (
    <HydrationBoundary>
      <Container maxW="container.xl">
        <Box p={5} bg="white" borderRadius={"lg"}>
          <HStack spacing={5} mb={3} justify={"space-between"}>
            <Heading size={"md"}>Romaneios</Heading>
            <IconButton
              size={"sm"}
              as={NextLink}
              href={`/romaneio/novo`}
              aria-label="Cadastrar usuário"
              icon={<FaPlus />}
              colorScheme="green"
            />
          </HStack>
          <WaybillList />
        </Box>
      </Container>
    </HydrationBoundary>
  );
}

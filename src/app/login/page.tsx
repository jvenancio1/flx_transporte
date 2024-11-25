import { Container } from "@chakra-ui/react";
import LoginForm from "./Form";

export default function Login() {
  return (
    <Container
      maxW="container.xl"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <LoginForm />
    </Container>
  );
}

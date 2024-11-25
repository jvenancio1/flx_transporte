import BackButton from "@/app/components/Admin/BackButton";
import { Container } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Properties from "./Properties";

export default async function NewAlarm() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <Container maxW="container.xl">
      <BackButton href={`/`} />
      <Properties userEmail={session.user!.email!} />
    </Container>
  );
}

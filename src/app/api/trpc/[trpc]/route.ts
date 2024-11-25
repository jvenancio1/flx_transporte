import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../trpc-route";

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: function (): object | Promise<object> {
      return {};
    },
  });
};

export { handler as GET, handler as POST };

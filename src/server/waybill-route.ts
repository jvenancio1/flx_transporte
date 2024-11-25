import { prisma } from "@/app/api/prisma";
import trpc from "@/utils/trpc-server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const waybillRouter = trpc.router({
  getMany: trpc.procedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional(),
          cursor: z.number().optional(),
          name: z.string().optional(),
          nameUser: z.string().optional(),
          licence: z.string().optional(),
          destination: z.string().optional(),
          id: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;

      const items = await prisma.waybill.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
        where: {
          id: input?.id ? +input.id : undefined,
          license_plate: input?.licence
            ? { contains: input.licence, mode: "insensitive" }
            : undefined,
          destination: input?.destination
            ? { contains: input.destination, mode: "insensitive" }
            : undefined,
          driver: {
            name: input?.name
              ? { contains: input.name, mode: "insensitive" }
              : undefined,
          },
          user: {
            name: input?.nameUser
              ? { contains: input.nameUser, mode: "insensitive" }
              : undefined,
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  count: trpc.procedure.query(async () => {
    const count = await prisma.waybill.count();

    return count;
  }),

  get: trpc.procedure.input(z.number()).query(async ({ input }) => {
    const res = await prisma.waybill.findUnique({
      where: {
        id: input,
      },
      include: {
        driver: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (res == null) throw new TRPCError({ code: "NOT_FOUND" });

    return res;
  }),

  create: trpc.procedure
    .input(
      z.object({
        license_plate: z.string(),
        nfe: z.string(),
        destination: z.string(),
        weight: z.string(),
        value_cte: z.string(),
        driver_name: z.string(),
        driver_cpf: z.string(),
        userEmail: z.string(),
        client: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const driver = await prisma.driver.upsert({
        where: {
          cpf: input.driver_cpf,
        },
        create: {
          name: input.driver_name,
          cpf: input.driver_cpf,
        },
        update: {
          name: input.driver_name,
        },
      });

      const idUser = await prisma.user.findUnique({
        where: {
          email: input.userEmail,
        },
      });

      if (!idUser) throw new Error(`User not found`);

      const res = await prisma.waybill.create({
        data: {
          license_plate: input.license_plate,
          client: input.client,
          nfe: input.nfe,
          weight: parseFloat(input.weight),
          value_cte: parseFloat(input.value_cte),
          total_cte: parseFloat(input.value_cte) * parseFloat(input.weight),
          destination: input.destination,
          user_id: idUser.id,
          driver_id: driver.id,
        },
      });

      return res;
    }),

  update: trpc.procedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          licence_place: z.string().optional(),
          nfe: z.string().optional(),
          destination: z.string().optional(),
          weight: z.number().optional(),
          value_cte: z.number().optional(),
          total_cte: z.number().optional(),
          driver_name: z.string().optional(),
          driver_cpf: z.string().optional(),
          userId: z.number(),
          client: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input: { id, data } }) => {
      const res = await prisma.waybill.update({
        where: { id },
        data,
      });
      return res;
    }),
});

export default waybillRouter;

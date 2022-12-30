import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const rankRouter = router({
  findByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.rank.findUnique({
        where: {
          name: input.name,
        },
        include: { items: true },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.$queryRaw<
      {
        name: string;
        totalComments: bigint;
        totalVotes: bigint;
        tags: string[];
        interactionsRatio: number;
      }[]
    >`
      SELECT r.name, ARRAY_AGG(DISTINCT t.name) as "tags",
       COUNT(v.id) AS "totalVotes", COUNT(c.id) AS "totalComments",
       (COUNT(v.id) + COUNT(c.id)) / (EXTRACT(MINUTE FROM NOW() - r."createdAt")) AS "interactionsRatio"
      FROM "Rank" r
      LEFT JOIN "RankItem" ri ON r.id = ri."rankId"
      LEFT JOIN "Vote" v ON ri.id = v."rankItemId"
      LEFT JOIN "Comment" c ON ri.id = c."rankItemId"
      LEFT JOIN "_RankToTag" rt ON r.id = rt."A"
      LEFT JOIN "Tag" t ON rt."B" = t.id
      GROUP BY r.id
      ORDER BY "interactionsRatio" DESC
    `;
  }),
});

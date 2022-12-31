import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const rankRouter = router({
  findByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.$queryRaw<
        {
          totalComments: bigint;
          totalRankItems: bigint;
          totalVotes: bigint;
          name: string;
          tags: string[];
        }[]
      >`
        SELECT r.name AS name,
                COUNT(DISTINCT ri.id) AS "totalRankItems",
                COUNT(DISTINCT v.id) AS "totalVotes",
                COUNT(DISTINCT c.id) AS "totalComments",
                ARRAY_AGG(DISTINCT t.name) AS tags
        FROM "Rank" r
        JOIN "RankItem" ri ON ri."rankId" = r.id
        LEFT JOIN "Vote" v ON v."rankItemId" = ri.id
        LEFT JOIN "Comment" c ON c."rankItemId" = ri.id
        JOIN "_RankToTag" rtt ON rtt."A" = r.id
        JOIN "Tag" t ON t.id = rtt."B"
        WHERE r.name = ${input.name}
        GROUP BY r.id
      `;

      return result[0];
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

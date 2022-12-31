import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const rankRouter = router({
  baseInfoByName: publicProcedure
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
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT t.name), NULL) AS tags
        FROM "Rank" r
        JOIN "RankItem" ri ON ri."rankId" = r.id
        LEFT JOIN "Vote" v ON v."rankItemId" = ri.id
        LEFT JOIN "Comment" c ON c."rankItemId" = ri.id
        LEFT JOIN "_RankToTag" rtt ON rtt."A" = r.id
        LEFT JOIN "Tag" t ON t.id = rtt."B"
        WHERE r.name = ${input.name}
        GROUP BY r.id
      `;

      return result[0];
    }),
  rankItemsByRankName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.$queryRaw<
        {
          rankItemTopComment: string;
          totalRankItemComments: bigint;
          totalRankItemVotes: bigint;
          rankItemName: string;
        }[]
      >`
      SELECT ri.name AS "rankItemName",
       COUNT(DISTINCT v.id) AS "totalRankItemVotes",
       COUNT(DISTINCT c.id) AS "totalRankItemComments",
       (SELECT c2.comment FROM "Comment" c2 WHERE c2."rankItemId" = ri.id AND c2.likes = (SELECT MAX(likes) FROM "Comment" WHERE "rankItemId" = ri.id) LIMIT 1 OFFSET 0) AS "rankItemTopComment"
      FROM "Rank" r
      JOIN "RankItem" ri ON ri."rankId" = r.id
      LEFT JOIN "Vote" v ON v."rankItemId" = ri.id
      LEFT JOIN "Comment" c ON c."rankItemId" = ri.id
      WHERE r.name = ${input.name}
      GROUP BY ri.id, ri.name
      ORDER BY COUNT(v.id) DESC
      `;
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
       COUNT(DISTINCT v.id) AS "totalVotes", COUNT(DISTINCT c.id) AS "totalComments",
       (COUNT(DISTINCT v.id) + COUNT(DISTINCT c.id)) / (EXTRACT(MINUTE FROM NOW() - r."createdAt")) AS "interactionsRatio"
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

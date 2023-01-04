import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const rank1ID = randomUUID();
  const rank2ID = randomUUID();

  const rankItem1ID = randomUUID();
  const rankItem2ID = randomUUID();
  const rankItem3ID = randomUUID();
  const rankItem4ID = randomUUID();

  const comment1ID = randomUUID();
  const comment2ID = randomUUID();

  const admin = await prisma.user.upsert({
    where: { email: "admin@vote-best.com" },
    update: {},
    create: {
      email: "admin@vote-best.com",
      name: "Admin",
      ranks: {
        createMany: {
          data: [
            { name: "greatest-football-player", id: rank1ID },
            { name: "best-song-ever", id: rank2ID },
          ],
        },
      },
      rankItems: {
        createMany: {
          data: [
            { name: "Lionel Messi", rankId: rank1ID, id: rankItem1ID },
            { name: "Pele", rankId: rank1ID, id: rankItem2ID },
            { name: "Diego Maradona", rankId: rank1ID },
            { name: "Johan Cryuff", rankId: rank1ID },
            { name: "Zinedine Zidane", rankId: rank1ID },
            { name: "Smells Like Teen Spirit", rankId: rank2ID },
            { name: "What's Going On", rankId: rank2ID },
            { name: "Strawberry Fields Forever", rankId: rank2ID },
            { name: "Get Ur Freak On", rankId: rank2ID },
            { name: "Dreams", rankId: rank2ID, id: rankItem4ID },
            { name: "Hey Ya!", rankId: rank2ID, id: rankItem3ID },
            { name: "God Only Knows", rankId: rank2ID },
            { name: "I Want to Hold Your Hand", rankId: rank2ID },
          ],
        },
      },
      votes: {
        createMany: {
          data: [
            { rankItemId: rankItem1ID },
            { rankItemId: rankItem1ID },
            { rankItemId: rankItem1ID },
            { rankItemId: rankItem1ID },
            { rankItemId: rankItem1ID },
            { rankItemId: rankItem2ID },
            { rankItemId: rankItem2ID },
            { rankItemId: rankItem2ID },
            { rankItemId: rankItem3ID },
            { rankItemId: rankItem3ID },
            { rankItemId: rankItem3ID },
            { rankItemId: rankItem4ID },
            { rankItemId: rankItem4ID },
            { rankItemId: rankItem4ID },
            { rankItemId: rankItem4ID },
            { rankItemId: rankItem4ID },
            { rankItemId: rankItem4ID },
          ],
        },
      },
      comments: {
        createMany: {
          data: [
            {
              rankItemId: rankItem1ID,
              comment: "The true G.O.A.T.",
              id: comment1ID,
            },
            { rankItemId: rankItem1ID, comment: "Leo es el mejor!" },
            {
              rankItemId: rankItem1ID,
              comment: "Best player I have seen in my lifetime",
            },
            { rankItemId: rankItem2ID, comment: "There is no one like him" },
            { rankItemId: rankItem2ID, comment: "O Rei", id: comment2ID },
            {
              rankItemId: rankItem3ID,
              comment: "Undescribable how this song make me feel",
            },
            { rankItemId: rankItem4ID, comment: "What a melody!" },
          ],
        },
      },
      likes: {
        createMany: {
          data: [
            { commentId: comment1ID },
            { commentId: comment2ID },
            { commentId: comment1ID },
            { commentId: comment1ID },
            { commentId: comment2ID },
          ],
        },
      },
    },
  });

  await prisma.rank.update({
    where: { id: rank1ID },
    data: {
      tags: {
        create: [
          {
            name: "football",
            userId: admin.id,
          },
          {
            name: "soccer",
            userId: admin.id,
          },
          {
            name: "sports",
            userId: admin.id,
          },
        ],
      },
    },
  });

  await prisma.rank.update({
    where: { id: rank2ID },
    data: {
      tags: {
        create: [
          {
            name: "music",
            userId: admin.id,
          },
          {
            name: "art",
            userId: admin.id,
          },
        ],
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

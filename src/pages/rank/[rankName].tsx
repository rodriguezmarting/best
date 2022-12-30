import { RankItem } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { HiDotsVertical } from "react-icons/hi";

import { trpc } from "../../utils/trpc";
import { unKebab } from "../../utils/unkebab";

const borderColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-[#C9B037]";
    case 2:
      return "bg-[#B4B4B4]";
    case 3:
      return "bg-[#AD8A56]";
    default:
      return "bg-black";
  }
};

const rankPrefix = (rank: number) => {
  switch (rank) {
    case 1:
      return <span className="pb-2 text-lg tracking-wider text-gray">🥇</span>;
    case 2:
      return <span className="pb-2 text-lg tracking-wider text-gray">🥈</span>;
    case 3:
      return <span className="pb-2 text-lg tracking-wider text-gray">🥉</span>;
    default:
      return <span className="text-xs tracking-wider text-gray">#{rank}</span>;
  }
};

const RankItem = ({ item, rank }: { item: RankItem; rank: number }) => {
  return (
    <div
      className={`flex w-full flex-col gap-3 border-b border-solid border-gray ${borderColor(
        rank
      )} py-2 px-3 shadow-lg first:border-t sm:border-x`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rankPrefix(rank)}
          <h2 className="text-md tracking-wide">{item.name}</h2>
        </div>
        <HiDotsVertical className="text-gray" />
      </div>
    </div>
  );
};

const Rank: NextPage = () => {
  const router = useRouter();

  const rankQuery = trpc.rank.findByName.useQuery(
    {
      name: router.query.rankName as string,
    },
    { enabled: !!router.query.rankName }
  );

  return (
    <>
      <main className="w-full flex-1 sm:w-3/4 md:w-3/5 lg:w-2/5">
        <div className="px-4 pt-10">
          <h1 className="text-lg tracking-wide">
            {unKebab(rankQuery.data?.name)}
          </h1>
          <p className="text-xs text-gray">
            {"21 options • 543 votes • 301 comments"}
          </p>
        </div>
        <div className="flex flex-col">
          {rankQuery.data?.items.map((item, index) => (
            <RankItem key={item.id} item={item} rank={++index} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Rank;

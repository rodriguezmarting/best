import { RankItem } from "@prisma/client";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { HiDotsVertical } from "react-icons/hi";

import { trpc } from "../../utils/trpc";
import { unKebab } from "../../utils/unkebab";

import GoldMedal from "../../../public/medal-gold.webp";
import SilverMedal from "../../../public/medal-silver.webp";
import BronzeMedal from "../../../public/medal-bronze.webp";
import { GoComment } from "react-icons/go";

const borderColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-[#181303]";
    case 2:
      return "bg-[#121212]";
    case 3:
      return "bg-[#120B04]";
    default:
      return "bg-black";
  }
};

const rankPrefix = (rank: number) => {
  switch (rank) {
    case 1:
      return <Image className="w-10" src={GoldMedal} alt="rank 1" />;
    case 2:
      return <Image className="w-10" src={SilverMedal} alt="rank 2" />;
    case 3:
      return <Image className="w-10" src={BronzeMedal} alt="rank 3" />;
    default:
      return <span className="text-xs tracking-wider text-gray">#{rank}</span>;
  }
};

const RankItem = ({ item, rank }: { item: RankItem; rank: number }) => {
  return (
    <div
      className={`flex w-full flex-col border-b border-solid border-gray ${borderColor(
        rank
      )} py-2 px-3 shadow-lg first:border-t sm:border-x`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rankPrefix(rank)}
          <h2 className="text-md tracking-wide">{item.name}</h2>
        </div>
        <p className="whitespace-nowrap text-xs tracking-wide">71M (30%)</p>
      </div>
      <div className="flex items-center justify-between text-xs text-gray">
        <q>The true G.O.A.T. is here</q>
        <div className="flex items-center justify-center gap-1">
          <GoComment className="pt-0.5" />
          <p className="tracking-wide">100K</p>
        </div>
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
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-lg tracking-wide">
            {unKebab(rankQuery.data?.name)}
          </h1>
          <p className="text-xs text-gray">
            {"21 options • 543 votes • 301 comments"}
          </p>
          <p className="text-2xs tracking-wide text-brand">
            #testing #some #tags
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

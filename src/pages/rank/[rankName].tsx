import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import { unKebab } from "../../utils/unkebab";

import GoldMedal from "../../../public/medal-gold.webp";
import SilverMedal from "../../../public/medal-silver.webp";
import BronzeMedal from "../../../public/medal-bronze.webp";
import { GoCheck, GoComment } from "react-icons/go";
import Link from "next/link";
import { shortNumber } from "../../utils/format";
import { signIn, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { useMemo } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ConditionalWrapper } from "../../utils/ConditionalWrapper";

const bgColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-dark-gold";
    case 2:
      return "bg-dark-silver";
    case 3:
      return "bg-dark-bronze";
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

const RankItem = ({
  item,
  rank,
  totalVotes,
  votedRank,
  showAuthDialog,
}: {
  item: RouterOutputs["rank"]["rankItemsByRankName"][number];
  rank: number;
  totalVotes: number;
  votedRank: number;
  showAuthDialog: boolean;
}) => {
  const votedByUser = votedRank === rank;

  return (
    <div
      className={`flex w-full flex-col  ${
        votedByUser
          ? "border-y border-brand"
          : votedRank - 1 !== rank
          ? "border-b border-gray "
          : "border-gray"
      } ${bgColor(
        rank
      )} border-solid py-2 px-3 shadow-lg first:border-t sm:border-x`}
    >
      <ConditionalWrapper
        condition={showAuthDialog}
        wrapper={(children) => <AuthDialog>{children}</AuthDialog>}
      >
        <button className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {rankPrefix(rank)}
            <h2 className="text-md tracking-wide">{item.rankItemName}</h2>
            {votedByUser ? <GoCheck className="text-brand" /> : null}
          </div>
          <p className="whitespace-nowrap text-xs tracking-wide">
            {shortNumber(item.totalRankItemVotes)} (
            {Math.floor((Number(item.totalRankItemVotes) / totalVotes) * 100)}
            %)
          </p>
        </button>
      </ConditionalWrapper>
      <div className="flex items-center justify-between text-xs text-gray">
        {item.rankItemTopComment ? (
          <q>{item.rankItemTopComment}</q>
        ) : (
          <div></div>
        )}
        <div className="flex items-center justify-center gap-1">
          <GoComment className="pt-0.5" />
          <p className="tracking-wide">
            {shortNumber(item.totalRankItemComments)}
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthDialog = ({ children }: { children: ReactNode }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-transparent-black" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-5/6 -translate-x-1/2 -translate-y-1/2 rounded-md bg-dark-gray p-6 text-white shadow-sm sm:w-3/5 md:w-2/5 lg:w-1/3 xl:w-1/4">
          <Dialog.Title>
            <h3 className="pb-2 text-lg">Before Voting:</h3>
          </Dialog.Title>
          <Dialog.Description>
            <p className="pb-6">Only authenticated users can vote!</p>
          </Dialog.Description>
          <div className="flex justify-center">
            <Dialog.Close asChild>
              <button
                onClick={() => signIn()}
                className="rounded-md bg-brand px-6 py-2 font-bold tracking-wider"
              >
                Sign In
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Rank: NextPage = () => {
  const router = useRouter();

  const rankBaseInfoQuery = trpc.rank.baseInfoByName.useQuery(
    {
      rankName: router.query.rankName as string,
    },
    { enabled: !!router.query.rankName }
  );

  const rankItemsQuery = trpc.rank.rankItemsByRankName.useQuery(
    {
      name: router.query.rankName as string,
    },
    { enabled: !!router.query.rankName }
  );

  const { data: sessionData } = useSession();
  const { data: userVote } = trpc.rank.userVote.useQuery(
    {
      rankName: router.query.rankName as string,
    },
    { enabled: sessionData?.user !== undefined }
  );

  const votedIndex = useMemo(() => {
    return rankItemsQuery.data
      ? rankItemsQuery.data.findIndex(
          (item) => item.rankItemName === userVote?.rankItem.name
        )
      : -1;
  }, [rankItemsQuery.data, userVote?.rankItem.name]);

  if (!rankBaseInfoQuery.data || !rankItemsQuery.data) {
    return <p>Loading...</p>;
  }

  const { name, tags, totalComments, totalRankItems, totalVotes } =
    rankBaseInfoQuery.data;

  return (
    <>
      <main className="w-full flex-1 sm:w-3/4 md:w-3/5 lg:w-2/5">
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-lg tracking-wide">{unKebab(name)}</h1>
          <p className="text-xs text-gray">
            {`${shortNumber(totalRankItems)} options • ${shortNumber(
              totalVotes
            )} votes • ${shortNumber(totalComments)} comments`}
          </p>
          <p className="text-2xs tracking-wide text-brand">
            {tags && tags.length > 0 && tags[0]
              ? tags.map((tag) => (
                  <Link href={`/tag/${tag}`} key={tag}>
                    #{tag}{" "}
                  </Link>
                ))
              : null}
          </p>
        </div>
        <div className="flex flex-col">
          {rankItemsQuery.data?.map((item, index) => (
            <RankItem
              key={item.rankItemName}
              item={item}
              rank={++index}
              totalVotes={Number(totalVotes)}
              votedRank={votedIndex + 1}
              showAuthDialog={sessionData?.user === undefined}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default Rank;

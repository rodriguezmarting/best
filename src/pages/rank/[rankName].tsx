import { type NextPage } from "next";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { unKebab } from "../../utils/unkebab";

import Link from "next/link";
import { shortNumber } from "../../utils/format";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { RankItemCard } from "../../components/RankItemCard";
import { LoadingSpinner } from "../../utils/LoadingSpinner";

import { useAutoAnimate } from "@formkit/auto-animate/react";

const Rank: NextPage = () => {
  const [isVoting, setIsVoting] = useState(false);
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
  const { data: userVote } = trpc.rank.getUserVote.useQuery(
    {
      rankName: router.query.rankName as string,
    },
    { enabled: sessionData?.user !== undefined }
  );

  const [animationParent] = useAutoAnimate();

  const votedIndex = useMemo(() => {
    return rankItemsQuery.data
      ? rankItemsQuery.data.findIndex(
          (item) => item.rankItemName === userVote?.rankItem.name
        )
      : -1;
  }, [rankItemsQuery.data, userVote?.rankItem.name]);

  if (!rankBaseInfoQuery.data || !rankItemsQuery.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={10} />
      </div>
    );
  }

  const currentVote = userVote?.rankItem.name;
  const showAuthDialog = sessionData?.user === undefined;

  const { name, tags, totalComments, totalRankItems, totalVotes } =
    rankBaseInfoQuery.data;

  console.log({
    isVoting,
    baseQuery: rankBaseInfoQuery.isFetching,
    ranks: rankItemsQuery.isFetching,
  });

  return (
    <main className="w-full flex-1 sm:w-3/4 md:w-3/5 lg:w-2/5">
      <div className="p-6">
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
      <ul className="flex flex-col" ref={animationParent}>
        {rankItemsQuery.data?.map((item, index) => (
          <RankItemCard
            key={item.rankItemName}
            item={item}
            rank={++index}
            totalVotes={Number(totalVotes)}
            votedRank={votedIndex + 1}
            currentVote={currentVote}
            showAuthDialog={showAuthDialog}
            setIsVoting={setIsVoting}
            showVoteDialog={
              showAuthDialog ||
              (!!currentVote && currentVote !== item.rankItemName)
            }
          />
        ))}
      </ul>
      {isVoting || rankItemsQuery.isFetching || rankBaseInfoQuery.isFetching ? (
        <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-transparent-black">
          <LoadingSpinner size={10} />
        </div>
      ) : null}
    </main>
  );
};

export default Rank;

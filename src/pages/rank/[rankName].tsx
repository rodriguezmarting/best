import { type NextPage } from "next";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";
import { unKebab } from "../../utils/unkebab";

import Link from "next/link";
import { shortNumber } from "../../utils/format";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { RankItemCard } from "../../components/RankItemCard";
import { LoadingSpinner } from "../../utils/LoadingSpinner";

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
  const { data: userVote } = trpc.rank.getUserVote.useQuery(
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
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={10} />
      </div>
    );
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
            <RankItemCard
              key={item.rankItemName}
              item={item}
              rank={++index}
              totalVotes={Number(totalVotes)}
              votedRank={votedIndex + 1}
              currentVote={userVote?.rankItem.name}
              showAuthDialog={sessionData?.user === undefined}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default Rank;

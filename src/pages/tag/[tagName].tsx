import { type NextPage } from "next";

import { useRouter } from "next/router";
import { RankCard } from "../../components/RankCard";
import { LoadingSpinner } from "../../utils/LoadingSpinner";
import { trpc } from "../../utils/trpc";

const TagPage: NextPage = () => {
  const router = useRouter();

  const ranksQuery = trpc.rank.getAllByTag.useQuery(
    { tag: router.query.tagName as string },
    { enabled: !!router.query.tagName }
  );

  return (
    <>
      <main className="w-full flex-1 sm:w-3/4 md:w-3/5 lg:w-2/5">
        <h1 className="flex w-full items-center gap-3 p-6 text-lg tracking-wide">
          #{router.query.tagName}
        </h1>
        <div className="flex flex-col">
          {!ranksQuery.data ? (
            <div className="flex items-center justify-center pt-12">
              <LoadingSpinner size={10} />
            </div>
          ) : (
            ranksQuery.data?.map((rank, index) => (
              <RankCard key={rank.name} rank={rank} index={++index} />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default TagPage;

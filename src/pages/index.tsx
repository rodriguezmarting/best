import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import trendingIcon from "../../public/trending-icon.webp";
import Image from "next/image";
import { RankCard } from "../components/RankCard";
import { LoadingSpinner } from "../utils/LoadingSpinner";

const Home: NextPage = () => {
  const ranksQuery = trpc.rank.getAll.useQuery();

  return (
    <>
      <main className="w-full flex-1 sm:w-3/4 md:w-3/5 lg:w-2/5">
        <h1 className="flex w-full items-center gap-3 p-6 text-lg tracking-wide">
          <Image
            src={trendingIcon}
            alt="trending"
            className="h-9 w-9 rounded-full"
          />
          Trending Ranks
        </h1>
        {!ranksQuery.data ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size={10} />
          </div>
        ) : (
          <div className="flex flex-col">
            {ranksQuery.data?.map((rank, index) => (
              <RankCard key={rank.name} rank={rank} index={++index} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Home;

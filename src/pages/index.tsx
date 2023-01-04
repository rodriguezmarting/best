import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import { unKebab } from "../utils/unkebab";
import trendingIcon from "../../public/trending-icon.webp";
import { GoCheck, GoComment } from "react-icons/go";
import { HiDotsVertical } from "react-icons/hi";
import Image from "next/image";
import { shortNumber } from "../utils/format";

const Rank = ({
  rank,
  index,
}: {
  rank: RouterOutputs["rank"]["getAll"][number];
  index: number;
}) => {
  return (
    <div className="hover:bg-black-gray flex w-full flex-col border-b border-solid border-gray bg-black py-2 px-3 shadow-lg first:border-t sm:border-x">
      <div className="flex items-center justify-between">
        <Link
          href={`/rank/${rank.name}`}
          className="flex w-full items-center gap-2 pb-3"
        >
          <span className="text-xs tracking-wider text-gray">
            {`#${index}`}{" "}
          </span>
          <h2 className="text-md tracking-wide">{unKebab(rank.name)}</h2>
        </Link>
        <div className="pb-3">
          <HiDotsVertical className="text-gray" />
        </div>
      </div>
      <div className="flex items-center justify-between text-gray">
        <p className="text-2xs tracking-wide text-brand">
          {rank.tags && rank.tags[0]
            ? rank.tags.map((tag) => (
                <Link href={`/tag/${tag}`} key={tag}>
                  #{tag}{" "}
                </Link>
              ))
            : null}
        </p>
        <Link href={`/rank/${rank.name}`} className="flex justify-end">
          <div className="flex gap-3 font-bold text-gray">
            <div className="flex items-center justify-center gap-1">
              <GoComment className="pt-0.5" />
              <p className=" text-2xs tracking-wide">
                {shortNumber(rank.totalComments)}
              </p>
            </div>
            <div className="flex items-center justify-center gap-0.5">
              <GoCheck />
              <p className="text-2xs tracking-wide">
                {shortNumber(rank.totalVotes)}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const ranksQuery = trpc.rank.getAll.useQuery();

  return (
    <>
      <main className="w-full flex-1 sm:w-3/4 md:w-3/5 lg:w-2/5">
        <h1 className="mb-4 flex w-full items-center gap-3 px-4 pt-10 text-lg tracking-wide">
          <Image
            src={trendingIcon}
            alt="trending"
            className="h-9 w-9 rounded-full"
          />
          Trending Ranks
        </h1>
        <div className="flex flex-col">
          {ranksQuery.data?.map((rank, index) => (
            <Rank key={rank.name} rank={rank} index={++index} />
          ))}
        </div>
      </main>
      <footer>
        <AuthShowcase />
      </footer>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

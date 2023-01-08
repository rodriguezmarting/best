import Link from "next/link";
import { GoCheck, GoComment } from "react-icons/go";
import { HiDotsVertical } from "react-icons/hi";
import { shortNumber } from "../../utils/format";
import type { RouterOutputs } from "../../utils/trpc";
import { unKebab } from "../../utils/unkebab";

export const RankCard = ({
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

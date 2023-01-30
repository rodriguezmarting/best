import { GoCheck, GoComment } from "react-icons/go";
import { ConditionalWrapper } from "../../utils/ConditionalWrapper";
import { shortNumber } from "../../utils/format";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import GoldMedal from "../../../public/medal-gold.webp";
import SilverMedal from "../../../public/medal-silver.webp";
import BronzeMedal from "../../../public/medal-bronze.webp";
import Image from "next/image";
import { VoteDialog } from "../VoteDialog";

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

export const RankItemCard = ({
  item,
  rank,
  totalVotes,
  votedRank,
  showAuthDialog,
  currentVote,
}: {
  item: RouterOutputs["rank"]["rankItemsByRankName"][number];
  rank: number;
  totalVotes: number;
  votedRank: number;
  showAuthDialog: boolean;
  currentVote?: string;
}) => {
  const votedByUser = votedRank === rank;
  const showVoteDialog =
    showAuthDialog || (!!currentVote && currentVote !== item.rankItemName);
  const utils = trpc.useContext();
  const vote = trpc.rank.vote.useMutation({
    onSuccess: () => {
      utils.invalidate();
    },
  });

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
        condition={showVoteDialog}
        wrapper={(children) => (
          <VoteDialog
            currentVote={currentVote ?? ""}
            newVote={item.rankItemName}
            showAuthDialog={showAuthDialog}
          >
            {children}
          </VoteDialog>
        )}
      >
        <button
          className="flex items-center justify-between"
          onClick={() => {
            if (!showVoteDialog) vote.mutate({ rankName: item.rankItemName });
          }}
        >
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

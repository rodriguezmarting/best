import { signIn } from "next-auth/react";
import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { GoArrowRight } from "react-icons/go";
import { trpc } from "../../utils/trpc";

export const VoteDialog = ({
  children,
  showAuthDialog,
  currentVote,
  newVote,
  setIsVoting,
}: {
  children: ReactNode;
  showAuthDialog: boolean;
  currentVote: string;
  newVote: string;
  setIsVoting: (isVoting: boolean) => void;
}) => {
  const utils = trpc.useContext();
  const vote = trpc.rank.vote.useMutation({
    onMutate: () => {
      setIsVoting(true);
    },
    onSuccess: () => {
      utils.invalidate();
      setIsVoting(false);
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-transparent-black" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-5/6 -translate-x-1/2 -translate-y-1/2 rounded-md bg-dark-gray p-6 text-white shadow-sm sm:w-3/5 md:w-2/5 lg:w-1/3 xl:w-1/4">
          <Dialog.Title className="pb-2 text-lg">
            {showAuthDialog ? "Before Voting:" : "Vote Update:"}
          </Dialog.Title>
          <Dialog.Description className="flex items-center gap-3 py-6">
            {showAuthDialog ? (
              "Only authenticated users can vote!"
            ) : (
              <>
                {currentVote}
                <GoArrowRight />
                {newVote}
              </>
            )}
          </Dialog.Description>
          <div className="flex justify-center">
            <Dialog.Close asChild>
              {showAuthDialog ? (
                <button
                  onClick={() => signIn()}
                  className="rounded-md bg-brand px-6 py-2 font-bold tracking-wider"
                >
                  Sign In
                </button>
              ) : (
                <button
                  onClick={() => vote.mutate({ rankName: newVote })}
                  className="rounded-md bg-brand px-6 py-2 font-bold tracking-wider"
                >
                  Change Vote
                </button>
              )}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

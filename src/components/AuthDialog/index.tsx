import { signIn } from "next-auth/react";
import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const AuthDialog = ({ children }: { children: ReactNode }) => {
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

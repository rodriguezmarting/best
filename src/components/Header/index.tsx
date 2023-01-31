import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo-white.svg";
import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <header className="flex w-full items-center justify-between bg-dark-gray p-4">
      <Link href="/">
        <Image className="w-12" alt="logo" src={Logo} />
      </Link>
      <button
        className="rounded-md bg-brand px-6 py-2 font-bold tracking-wider"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign Out" : "Sign In"}
      </button>
    </header>
  );
};

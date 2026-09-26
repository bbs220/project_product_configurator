import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black h-screen w-screen">
      <Link href={"/configurator"}>
        <button>hello</button>
      </Link>
    </div>
  );
}

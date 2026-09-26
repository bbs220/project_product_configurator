import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-white font-sans h-screen w-screen">
      <main className="w-full h-full">
        <Link href={"/configurator"}>
          <button className="text-black border p-2 rounded-lg hover:cursor-pointer">
            Configurator
          </button>
        </Link>
      </main>
    </div>
  );
}

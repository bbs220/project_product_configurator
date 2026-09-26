import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white font-sans h-screen w-screen">
      <main className="w-full h-full flex items-center justify-center">
        <Link href={"/configurator"}>
          <button className="text-black border p-3 rounded-lg hover:cursor-pointer">
            Configurator
          </button>
        </Link>
      </main>
    </div>
  );
}

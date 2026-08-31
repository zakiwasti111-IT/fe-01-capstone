import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">AI Bio Builder</h1>
      <p className="mt-2 text-gray-700">
        Generate a short professional bio you can edit and copy.
      </p>
      <Link
        className="mt-6 inline-block rounded bg-black px-4 py-2 text-white"
        href="/generator"
      >
        Open Bio Generator
      </Link>
    </main>
  );
}
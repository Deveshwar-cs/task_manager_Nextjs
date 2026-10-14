"use client";

import {useEffect} from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <main className="p-8">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>

      <p className="mt-2">We could not load this page.</p>

      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
      >
        Try again
      </button>
    </main>
  );
}

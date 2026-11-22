"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">The page failed to load. Try again.</p>
      <button onClick={reset} className="mt-6 text-sm font-medium underline underline-offset-4">
        Retry
      </button>
    </div>
  );
}

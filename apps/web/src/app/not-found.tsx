import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">That page or record doesn&rsquo;t exist in this demo.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
        Back to overview
      </Link>
    </div>
  );
}

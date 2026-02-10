import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-clash text-6xl font-bold mb-4 gradient-text">
          404
        </h1>
        <p className="text-dark-text-light text-lg mb-8">
          This proposal could not be found.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-white font-medium text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

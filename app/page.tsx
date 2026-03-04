import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      <header className="absolute top-0 right-0 p-6">
        <ThemeToggle />
      </header>
      <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="font-clash text-5xl font-bold">
          2<span className="gradient-text">FLY</span>
        </h1>
        <p className="text-dark-text text-lg">Interactive Proposal Portal</p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-accent-pink text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go to Admin Dashboard
        </Link>
      </div>
      </div>
    </div>
  );
}

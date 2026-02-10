"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-dark-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-clash text-3xl font-bold">
              2<span className="gradient-text">FLY</span>
            </h1>
            <p className="text-dark-text mt-2">Admin Dashboard</p>
          </div>
          <form
            onSubmit={handleLogin}
            className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4"
          >
            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-dark-text mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-accent-purple transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-dark-text mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-accent-purple transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent-pink to-accent-purple text-white font-medium text-sm disabled:opacity-50"
            >
              {loggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Admin Header */}
      <header className="border-b border-dark-border bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-clash text-xl font-bold">
              2<span className="gradient-text">FLY</span>
            </span>
            <span className="text-dark-text text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-dark-text text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-dark-text hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

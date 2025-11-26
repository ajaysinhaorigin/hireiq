'use client';

import { useAuth } from '@/shared/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-zinc-900 dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl text-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Welcome to{' '}
            <span className="bg-linear-to-r from-zinc-800 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
              HireIQ
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Your intelligent recruitment platform connecting top talent with
            amazing opportunities. Join as a job seeker or recruiter to get
            started.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-md bg-zinc-900 px-8 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 sm:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="w-full rounded-md border border-zinc-300 bg-white px-8 py-3 text-center text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 sm:w-auto dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
              <svg
                className="h-6 w-6 text-zinc-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              For Job Seekers
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Find your dream job with our intelligent matching system
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
              <svg
                className="h-6 w-6 text-zinc-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              For Recruiters
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Discover and connect with qualified candidates effortlessly
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
              <svg
                className="h-6 w-6 text-zinc-900 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              Smart & Fast
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              AI-powered platform for faster, better recruitment decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

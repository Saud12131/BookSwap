"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // prevent flicker while checking
  if (isLoggedIn === null) return null;

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="bg-blue-50">
        <div className="max-w-3xl mx-auto px-6 py-28 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Swap Books. <br />
            <span className="text-blue-600">Save Money.</span> <br />
            Read More.
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            BookSwap lets you exchange books with others instead of buying new
            ones. Simple, affordable, and community-driven.
          </p>

          {/* 🔥 CONDITIONAL BUTTONS */}
          <div className="mt-8 flex justify-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/books"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Books
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>

                <Link
                  href="/login"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why BookSwap?
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl hover:shadow-md transition text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                🔄 Easy Book Exchange
              </h3>
              <p className="mt-3 text-gray-600">
                List books you own and swap them with others in just a few
                clicks.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-md transition text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                💸 Save Money
              </h3>
              <p className="mt-3 text-gray-600">
                No need to buy new books. Exchange and reuse books at zero cost.
              </p>
            </div>

            <div className="p-6 border rounded-xl hover:shadow-md transition text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                🌍 Community Driven
              </h3>
              <p className="mt-3 text-gray-600">
                Join a growing community of readers who believe in sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to start swapping books?
          </h2>
          <p className="mt-4 text-blue-100">
            Create your free account and start exchanging books today.
          </p>

          {!isLoggedIn && (
            <Link
              href="/signup"
              className="inline-block mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Join BookSwap
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} BookSwap. All rights reserved.
      </footer>
    </main>
  );
}

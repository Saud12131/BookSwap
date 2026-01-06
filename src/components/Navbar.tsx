"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth(); // initial check

    // 🔥 listen to login/logout changes
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔥 notify navbar instantly
    window.dispatchEvent(new Event("auth-change"));

    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <nav className="w-full bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          BookSwap
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn && (
            <Link
              href="/books/create"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Post a book
            </Link>
          )}

          <Link
            href="/books"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Books
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 py-4 space-y-4">
          {isLoggedIn && (
            <Link
              href="/books/create"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600"
            >
              Post a book
            </Link>
          )}

          <Link
            href="/books"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 hover:text-blue-600"
          >
            Books
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="block bg-blue-600 text-white text-center py-2 rounded-lg font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

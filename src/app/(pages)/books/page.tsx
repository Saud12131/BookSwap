"use client";

import { useEffect, useState } from "react";
import BASE_URL from "@/src/base";
import Link from "next/link";
interface Book {
  _id: string;
  name: string;
  subject: string;
  description: string;
  price: number;
  isAvailable: boolean;
  owner?: {
    email: string;
  };
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
      const res = await fetch(`${BASE_URL}/api/book/getallbooks`); // adjust if route name differs
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch books");
        }

        setBooks(data.books || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No books available right now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        All Books
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <img
              src="/book-demo.jpg"
              alt={book.name}
              className="w-full h-40 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900">
              {book.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {book.subject}
            </p>

            <p className="text-gray-600 mt-3 text-sm">
              {book.description}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold text-blue-600">
                ₹{book.price}
              </span>

              <span
                className={`text-sm font-medium ${
                  book.isAvailable
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {book.isAvailable ? "Available" : "Not Available"}
              </span>
            </div>

            {book.owner?.email && (
              <p className="mt-3 text-xs text-gray-400">
                Seller: {book.owner.email}
              </p>
            )}

          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
            <Link href={`/books/bookinfo/${book._id}`} className="block text-center">
              View Details
            </Link>
          </button>
          </div>
        ))}
      </div>
    </div>
  );
}

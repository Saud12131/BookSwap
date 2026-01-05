"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BASE_URL from "@/src/base";
import toast from "react-hot-toast";

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

export default function BookInfoPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const handlepurchase = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/book/purchase/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to purchase book");
      }

       toast.success("Book purchased successfully 📚");
      router.push("/books");
    } catch (err: any) {
      alert(err.message);
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchBook() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/book/bookdetail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch book");
        }

        setBook(data.book);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchBook();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || "Book not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-12 flex justify-center">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-8">
        <img
          src="/book-demo.jpg"
          alt={book.name}
          className="w-full h-60 object-cover rounded-t-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-blue-600">
          {book.name}
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Subject: {book.subject}
        </p>

        <p className="mt-4 text-gray-700">
          {book.description}
        </p>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ₹{book.price}
          </span>

          <span
            className={`text-sm font-semibold ${
              book.isAvailable
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {book.isAvailable ? "Available" : "Not Available"}
          </span>
        </div>

        {book.owner?.email && (
          <p className="mt-4 text-sm text-gray-500">
            Seller: {book.owner.email}
          </p>
        )}

        <button
          onClick={() => handlepurchase()}
          className="mt-8 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          BUY BOOK
        </button>
      </div>
    </div>
  );
}

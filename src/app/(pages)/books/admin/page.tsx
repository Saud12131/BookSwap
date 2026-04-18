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
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [soldBooks, setSoldBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        let token = localStorage.getItem('token');
        console.log('Token from localStorage:', token ? token.substring(0, 20) + '...' : 'null');
        
        // Remove 'Bearer ' prefix if it exists
        if (token && token.startsWith('Bearer ')) {
          token = token.substring(7);
        }
        
        if (!token) {
          setError("Please login to access this page");
          setAuthChecking(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/api/user/checkadmin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          setIsAdmin(true);
          fetchSoldBooks();
        } else {
          setError("Access denied. Admin privileges required.");
        }
      } catch (err: any) {
        setError("Authentication failed");
      } finally {
        setAuthChecking(false);
        setLoading(false);
      }
    };

    const fetchSoldBooks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/book/getsoldbooks`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch sold books");
        }

        setSoldBooks(data.books || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading sold books...</p>
      </div>
    );
  }

  if (error && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard - Sold Books
          </h1>
          <Link 
            href="/books" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            View All Books
          </Link>
        </div>

        {soldBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No sold books found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sold Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {soldBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {book.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {book.description.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ₹{book.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.owner?.email || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(book.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/books/bookinfo/${book._id}`}
                          className="text-blue-600 hover:text-blue-900 underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Total Sold Books</p>
              <p className="text-2xl font-bold text-red-700">{soldBooks.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">
                ₹{soldBooks.reduce((sum, book) => sum + book.price, 0)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Average Book Price</p>
              <p className="text-2xl font-bold text-blue-700">
                ₹{soldBooks.length > 0 ? Math.round(soldBooks.reduce((sum, book) => sum + book.price, 0) / soldBooks.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

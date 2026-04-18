import { connectDB } from "@/src/lib/mongo";
import Books from "@/src/models/book";
import "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get sold books (books that are not available)
    const soldBooks = await Books.find({ isAvailable: false }).populate("owner");

    if (soldBooks.length === 0) {
      return NextResponse.json(
        { message: "No sold books found", books: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { books: soldBooks },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

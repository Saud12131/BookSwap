import { connectDB } from "@/src/lib/mongo";
import Books from "@/src/models/book";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const allBooks = await Books.find({isAvailable: true}).populate("owner");

    if (allBooks.length === 0) {
      return NextResponse.json(
        { message: "No books found", books: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { books: allBooks },
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

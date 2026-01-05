import { connectDB } from "@/src/lib/mongo";
import Books from "@/src/models/book";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ await params FIRST
    const { id: bookid } = await context.params;

    const book = await Books.findByIdAndUpdate(bookid,
        {isAvailable: false},
        {new: true}
    )
    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
        { message: "Book purchased successfully", book },
        { status: 200 }
    )
   
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

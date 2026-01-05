import { connectDB } from "@/src/lib/mongo";
import Books from "@/src/models/book";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 🔐 Authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const userID = decoded?.userId || decoded?.id;
    if (!userID) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, subject, description, price, isAvailable } = body;

    if (
      !name ||
      !subject ||
      !description ||
      price === undefined ||
      isAvailable === undefined
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newBook = await Books.create({
      name,
      subject,
      description,
      price,
      isAvailable,
      owner: userID,
    });

    return NextResponse.json(
      { message: "Book created successfully", book: newBook },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

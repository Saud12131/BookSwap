import { connectDB } from "@/src/lib/mongo";
import User from "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { id: string };
    } catch (jwtError: any) {
      console.error('JWT Error:', jwtError.message);
      return NextResponse.json(
        { message: "Invalid token: " + jwtError.message },
        { status: 401 }
      );
    }
    
    // Find user and check if admin
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.userType !== 'admin') {
      return NextResponse.json(
        { message: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Admin access granted", isAdmin: true },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
}

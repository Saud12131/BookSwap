import { connectDB } from "@/src/lib/mongo";
import User from "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/src/lib/jwt";
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, password } = body;
        if (!email || !password) {
            return NextResponse.json({ message: "Email and Password are required" }, { status: 400 });
        }
        const user = await User.findOne({ email }).select("+password").exec();
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }
        const token = signToken({ id: user.id, email: user.email });
        return NextResponse.json(
            {
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
} 
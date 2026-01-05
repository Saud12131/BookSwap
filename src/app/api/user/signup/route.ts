import { connectDB } from "@/src/lib/mongo";
import User from "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, password } = body;
        const isExistingUser = await User.findOne({ email: email, password: password })
        if (!isExistingUser) {
            const newUser = new User({ email, password });
            await newUser.save();
            return NextResponse.json({ message: "User created successfully" }, { status: 201 });
        } else {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
} 
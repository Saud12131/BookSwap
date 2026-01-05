// src/lib/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET;

// 👇 force correct type
const JWT_OPTIONS: SignOptions = {
  expiresIn: "7d",
};

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
}

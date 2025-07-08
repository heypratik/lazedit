import { NextResponse } from "next/server";
import User from "../../../../models/user";

export async function GET(req) {
  try {
    const users = await User.findAll();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

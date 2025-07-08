import { NextResponse } from "next/server";
const { User, Organization } = require("../../../../models");

async function getOrganizationByUserId(userId) {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Organization,
        as: "organization",
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.organization;
  } catch (error) {
    console.error("Error fetching organization:", error.message);
    throw error;
  }
}

export async function GET(req) {
  try {
    const users = await getOrganizationByUserId(1);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

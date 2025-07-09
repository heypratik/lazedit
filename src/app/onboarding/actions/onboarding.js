"use server";

const { User, Organization } = require("../../../../models");
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { where } from "sequelize";

export default async function getOnboarded({
  organizationId,
  organizationName,
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("User not authenticated");
    }
    const org = await Organization.findOne({
      where: {
        id: organizationId,
      },
    });

    console.log("Organization: Reached");

    if (!org) {
      throw new Error("Organization not found");
    }

    // Update Store with onboarding data
    const updatedStore = await org.update({
      name: organizationName,
    });

    console.log("Updated Store: Reacjed");

    // Update User with onboarding data
    const user = await User.findOne({
      where: {
        id: session.user.id,
      },
    });

    console.log("User: Reached");

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await user.update({
      onboarded: true,
    });

    return updatedStore.toJSON();
  } catch (error) {
    console.error("Error getting onboarded:", error);
    throw error;
  }
}

export async function getOrganizationByUserId(userId) {
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

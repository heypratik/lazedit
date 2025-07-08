"use server";

import Store from "../../../../models/Store";
const { User, Organization } = require("../../../../models");

export default async function getOnboarded({
  storeId,
  klaviyoKey,
  location,
  domain,
  mediaObjectKey,
}) {
  try {
    const store = await Store.findOne({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    // Update Store with onboarding data
    const updatedStore = await store.update({
      klaviyoKey,
      location,
      domain,
      mediaObjectKey,
    });

    // Update User with onboarding data
    const user = await User.findOne({
      where: {
        id: store.userId,
      },
    });

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

// export async function getStoreByUserId(userId) {
//   try {
//     const store = await Store.findOne({
//       where: {
//         userId,
//       },
//     });

//     return store.toJSON();
//   } catch (error) {
//     console.error("Error getting store by userId:", error);
//     throw error;
//   }
// }

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

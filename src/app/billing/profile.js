"use client";

import React, { useState, useEffect } from "react";
import { Divider } from "../layout/divider";
import { Button } from "../layout/button";
import toast, { Toaster } from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";

function Profile({ session, user }) {
  // States
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Change for All Inputs

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      setFullName(fullName);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      notification(false, "User not found");
      return;
    }

    // Check if all fields are filled & valid & not empty strings
    if (!fullName || !email) {
      notification(false, "All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: storeName,
          domain: domain,
          email: email,
          klaviyoKey: klaviyoKey,
          mediaObjectKey: "logo",
          location: location,
          socials: socials,
          colors: colors,
          userId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        notification(true, "Save successfully");
      } else {
        notification(false, "Something went wrong.");
        console.error("Failed to create store");
      }
    } catch (error) {
      notification(false, "Something went wrong.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
  }, [session]);

  function notification(success, message) {
    if (success) {
      toast.success(message);
    } else {
      toast.error(message || "An error occurred");
    }
  }

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl font-bold text-white/70">Profile</h1>
      <Divider />
      <div className="flex flex-col max-w-4xl mx-auto">
        <div className="mt-6 items-center justify-between gap-4 flex">
          <label
            htmlFor="fullName"
            className="form-label font-bold flex flex-col"
          >
            <span className="text-base text-white">Full Name</span>
            <span className="text-sm text-white/70 font-normal">
              Your full name.
            </span>
          </label>
          <input
            type="text"
            className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={handleInputChange}
            placeholder="Apple Inc"
          />
        </div>
        <Divider />

        <div className="mt-6 items-center justify-between gap-4 flex">
          <label htmlFor="email" className="form-label font-bold flex flex-col">
            <span className="text-base text-white">Email</span>
            <span className="text-sm text-white/70 font-normal">
              Your primary email for account related communication.
            </span>
          </label>
          <input
            type="email"
            className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="contact@example.com"
          />
        </div>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button outline className="bg-black text-white">
            Cancel
          </Button>
          <Button className="bg-black text-white" onClick={handleSubmit}>
            Save
            {isLoading && <RiLoader4Fill className="animate-spin ml-1" />}
          </Button>
        </div>
      </div>
      <Divider className="mb-6" />
    </div>
  );
}

export default Profile;

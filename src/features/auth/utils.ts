import { redirect } from "next/navigation";

// import { auth } from "@/auth";

export const protectServer = async () => {
  const session = true;

  if (!session) {
    redirect("/api/auth/signin");
  }
};

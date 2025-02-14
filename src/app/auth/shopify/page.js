"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tab";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

function Auth() {
  const router = useRouter();
  const params = useSearchParams();

  const [store, setStore] = useState(null);
  const [storeEmail, setStoreEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [password, setPassword] = useState("");
  const [activeStep, setActiveStep] = useState("Authenticating Store...");
  const [lottieOptions, setLottieOptions] = useState(null);

  // Initialize Lottie options after component mounts
  useEffect(() => {
    import("./../animation.json").then((animationData) => {
      setLottieOptions({
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      });
    });
  }, []);

  async function submitFunction() {
    setIsLoading(true);
    try {
      const status = await signIn("credentials", {
        redirect: false,
        email: storeEmail,
        password: password,
        type: "shopify",
        shopifyStoreId: store,
        callbackUrl: "/settings",
      });

      if (status?.ok) {
        setRedirect(true);
        router.push("/settings");
        notification(true, "Login Successful");
      } else {
        notification(false, status?.error);
      }
    } catch (error) {
      notification(false, "An error occurred during login");
    }
    setIsLoading(false);
  }

  async function startAuth() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/auth/shopify", {
        method: "POST",
        body: JSON.stringify({ shopifyStoreId: store, email: storeEmail }),
      });

      if (response.ok) {
        setActiveStep("Logging In...");
        await submitFunction();
      } else {
        notification(false, "Something Went Wrong.");
      }
    } catch (error) {
      notification(false, "Authentication failed");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (params) {
      const storeEmail = params.get("email");
      if (storeEmail) {
        setStoreEmail(storeEmail);
      }
      const shopifyStore = params.get("shop");
      setStore(shopifyStore);
    }
  }, [params]);

  useEffect(() => {
    if (store) {
      startAuth();
    }
  }, [store]);

  function notification(success, message) {
    if (success) {
      toast.success(message);
    } else {
      toast.error(message || "An error occurred");
    }
  }

  return (
    <>
      <Toaster />
      <Dialog open={redirect}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="flex justify-center items-center flex-col">
              <div className="flex flex-col space-y-3">
                {lottieOptions && (
                  <Lottie options={lottieOptions} height={400} width={400} />
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex min-h-full flex-1">
        <div className="relative w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover bg-[#f6f6f6]"
            src="https://www.mybranz.com/images/art/best.svg"
            alt=""
          />
        </div>
        <div className="flex flex-1 min-w-[30%] flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex justify-start items-center gap-4">
              <img
                className="w-20 h-20 text-center rounded-full"
                src="https://www.mybranz.com/logo.png"
                alt="MyBranz Logo"
              />
              <span className="font-bold text-xl">X</span>
              <img
                className="w-20 h-20 text-center rounded"
                src="https://cdn3.iconfinder.com/data/icons/social-media-2068/64/_shopping-512.png"
                alt="Shopping Icon"
              />
            </div>
            <div className="min-h-[300px] border border-gray-200 rounded-xl mt-5 flex items-center justify-center">
              <div className="flex items-center justify-center gap-4">
                <RiLoader4Fill fontSize={20} className="spinner" />
                {activeStep}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AuthWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Auth />
    </Suspense>
  );
}

export default AuthWrapper;

"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [lottieOptions, setLottieOptions] = useState(null);

  // Initialize Lottie options after component mounts
  useEffect(() => {
    import("./animation.json").then((animationData) => {
      setLottieOptions({
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      });
    });
  }, []);

  // Handle enter key press using useCallback to memoize the handler
  const handleEnterPress = React.useCallback(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitFunction();
      }
    },
    [email, password, isLogin]
  );

  // Add event listener only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleEnterPress);
      return () => {
        window.removeEventListener("keydown", handleEnterPress);
      };
    }
  }, [handleEnterPress]);

  async function submitFunction() {
    setIsLoading(true);
    try {
      if (isLogin) {
        const status = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
          type: "custom",
          callbackUrl: "/dashboard",
        });

        if (status?.ok) {
          setRedirect(true);
          router.push("/dashboard");
          notification(true, "Login Successful");
        } else {
          notification(false, status?.error);
        }
      } else {
        await signupFunction();
      }
    } catch (error) {
      notification(false, "An error occurred");
    }
    setIsLoading(false);
  }

  async function signupFunction() {
    try {
      const response = await fetch("/api/admin/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        notification(true, "Signup Successful");

        const status = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
          type: "custom",
          callbackUrl: "/billing",
        });

        if (status?.ok) {
          setRedirect(true);
          router.push("/billing");
          notification(true, "Login Successful");
        } else {
          notification(false, status?.error);
        }
      } else {
        const errorData = await response.json();
        notification(false, errorData.message || "Signup Failed");
      }
    } catch (error) {
      notification(false, "An error occurred during signup");
    }
  }

  function notification(success, message) {
    if (success) {
      toast.success(message);
    } else {
      toast.error(message || "An error occurred");
    }
  }

  const inputStyles =
    "block w-full rounded-md border-2 border-gray-300 focus:border-[#f23251] p-2 ring-0 ring-inset ring-[#f23251] placeholder:text-gray-400 sm:text-sm sm:leading-6";

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
      <div className="flex min-h-full flex-1 h-[100vh]">
        <div className="relative w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover bg-[#f6f6f6]"
            src="https://www.mybranz.com/images/art/best.svg"
            alt="Background illustration"
          />
        </div>
        <div className="flex flex-1 min-w-[30%] flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex justify-start">
              <img
                className="w-28 text-center"
                src="/black-logo-full.png"
                alt="Company logo"
              />
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {isLogin ? "Welcome back!" : "Create your account"}
            </h2>

            {/* Tab Navigation */}
            <div className="mt-6">
              <div className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  disabled={isLoading}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isLogin
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    !isLogin
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="mt-10">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className={inputStyles}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={inputStyles}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className={inputStyles}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      type="button"
                      className="pl-1 font-bold text-[#000] underline"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? "Sign up" : "Login"}
                    </button>
                  </p>
                </div>

                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-[#000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000] items-center gap-2"
                  onClick={submitFunction}
                  disabled={isLoading}
                >
                  {isLogin ? "Login" : "Sign up"}
                  {isLoading && (
                    <RiLoader4Fill fontSize={20} className="spinner" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;

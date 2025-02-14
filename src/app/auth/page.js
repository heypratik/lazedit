"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import * as animationData from "./animation.json";
import Lottie from "react-lottie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  async function submitFunction() {
    setIsLoading(true);
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
        console.log("LOGIN SUCCESSFUL");
      } else {
        notification(false, status?.error);
        // notify user the error message from status.error
      }
      setIsLoading(false);
    } else {
      signupFunction();
    }
  }

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitFunction();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEnterPress);
    return () => {
      document.removeEventListener("keydown", handleEnterPress);
    };
  }, []);

  async function signupFunction() {
    setIsLoading(true);
    const response = await fetch("/api/admin/auth/signup", {
      method: "POST",
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
        // notify user the error message from status.error
      }
    } else {
      notification(false, "Signup Failed");
    }
    setIsLoading(false);
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
        <div className=""></div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="flex justify-center items-center flex-col">
              <div className="flex flex-col space-y-3">
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                  }}
                  height={400}
                  width={400}
                />
              </div>
              <div></div>
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
            <div className="flex justify-start">
              <img
                className="w-20 h-20 text-center rounded-full"
                src="https://www.mybranz.com/logo.png"
              />
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {isLogin ? "Welcome back!" : "Create your account"}
            </h2>
            <Tabs value={isLogin ? "login" : "signup"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  disabled={isLoading}
                  value="login"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  disabled={isLoading}
                  value="signup"
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="mt-10">
                  <div>
                    <form action="#" method="POST" className="space-y-6">
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
                        {/* <div className="text-sm leading-6">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-[#f23251]">
                        Forgot password?
                      </a>
                    </div> */}
                        <p className="text-sm text-gray-500">
                          {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                          <button
                            variant="link"
                            className="pl-1  font-bold text-[#f23251] underline"
                            onClick={() => setIsLogin(!isLogin)}
                          >
                            {isLogin ? "Sign up" : "Login"}
                          </button>
                        </p>
                      </div>

                      <div></div>
                    </form>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <div className="mt-10">
                  <div>
                    <form action="#" method="POST" className="space-y-6">
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
                        {/* <div className="text-sm leading-6">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-[#f23251]">
                        Forgot password?
                      </a>
                    </div> */}
                        <p className="text-sm text-gray-500">
                          {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                          <button
                            variant="link"
                            className="pl-1 font-bold text-[#f23251] underline"
                            onClick={() => setIsLogin(!isLogin)}
                          >
                            {isLogin ? "Sign up" : "Login"}
                          </button>
                        </p>
                      </div>

                      <div></div>
                    </form>
                  </div>
                </div>
              </TabsContent>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#f23251] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#f23251] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f23251] items-center gap-2"
                onClick={submitFunction}
              >
                {isLogin ? "Login" : "Sign up"}
                <span>
                  <RiLoader4Fill
                    fontSize={20}
                    className={`spinner ${isLoading ? "block" : "hidden"}`}
                  />
                </span>
              </button>
            </Tabs>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}

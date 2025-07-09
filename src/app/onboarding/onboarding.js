"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RiLoader4Fill } from "react-icons/ri";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import CustomLayout from "../layout/layout";
import toast, { Toaster } from "react-hot-toast";
import getOnboarded from "./actions/onboarding";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Onboarding({ organization }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);

  const {
    mutate: onboardStore,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: getOnboarded,
    onError: (error) => {
      toast.error("Error onboarding store");
    },
    onSuccess: () => {
      toast.success("User onboarded successfully");
      router.push("/dashboard");
    },
  });

  const handleOnboarding = () => {
    onboardStore({
      organizationId: organization.id,
      organizationName: formState.name,
    });
  };

  const [formState, setFormState] = useState({
    name: organization?.name || "",
  });

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <CustomLayout>
      <Toaster />
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">
              Welcome to LazeEdit
            </h1>
            <p className="text-sm text-white/70">
              Let's set up your organization information.
            </p>
          </div>
        </div>

        {/* Progress bar removed */}

        <Card className="glass-strong">
          <CardHeader className="cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Building2 className="h-5 w-5" color="#fff" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">
                    Organization
                  </CardTitle>
                  <p className="text-sm text-white/70">
                    Add all information about your organization
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {expanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border p-2"
                        value={formState.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Organization Name"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="bg-white text-black font-semibold"
                        // Remove progress check from disabled
                        onClick={handleOnboarding}
                      >
                        <RiLoader4Fill
                          className={`text-[#000] ${
                            isPending ? "animate-spin" : "hidden"
                          } mr-2`}
                        />
                        Finish Onboarding
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </CustomLayout>
  );
}

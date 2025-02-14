"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getSignedUrlCf } from "@/lib/s3";
import { RiLoader4Fill } from "react-icons/ri";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { getName, getCodes } from "country-list";
import CustomLayout from "../layout/layout";
import toast, { Toaster } from "react-hot-toast";
import { FaUndo } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import getOnboarded from "./actions/onboarding";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

const CustomImage = ({ objectKey, store, width, height, imageLoading }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      const signedUrl = await getSignedUrlCf(objectKey, store.id, "10years");
      setImageData(signedUrl);
      imageLoading(false);
      return signedUrl;
    }

    fetchImage();
  }, [objectKey, store.id, imageLoading]);

  return imageData ? (
    <img
      src={imageData}
      alt={`custom-${imageData}`}
      className="w-24 h-24 border-2 object-cover border-gray-200 rounded-md prod-images"
    />
  ) : (
    <div className="bg-gray-50 rounded-md w-24 h-24 border shadow-sm border-[#DDDDDD] flex items-center justify-center">
      <CiImageOn color="#818181" fontSize="20px" />
    </div>
  );
};

export default function Onboarding({ store }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logoObjectKey, setLogoObjectKey] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

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
      toast.success("Store onboarded successfully");
      router.push("/settings");
    },
  });

  const handleOnboarding = () => {
    onboardStore({
      storeId: store.id,
      klaviyoKey: formState.klaviyoKey,
      location: formState.countryCode,
      domain: formState.domain,
      mediaObjectKey: logoObjectKey,
    });
  };

  const [formState, setFormState] = useState({
    klaviyoKey: "",
    countryCode: "",
    domain: "",
  });

  // Calculate filled fields whenever form state or logo changes
  useEffect(() => {
    const filledFieldsCount =
      Object.values(formState).filter(
        (value) => value && value.trim().length > 0
      ).length + (logoObjectKey ? 1 : 0);

    const newProgress = Math.floor((filledFieldsCount / 4) * 100);
    setProgress(newProgress);
  }, [formState, logoObjectKey]);

  const uploadFile = async (file) => {
    setImageUploading(true);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const response = await fetch(`/api/admin/user/upload-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "File-Name": file.name,
        Mimetype: file.type,
        Store: store?.id,
      },
      body: buffer,
    });

    if (!response.ok) {
      setImageUploading(false);
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const handleImageChange = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        try {
          const response = await uploadFile(files[0]);
          if (response.success && response.data.objectKey) {
            setLogoObjectKey(response.data.objectKey);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },
    [store?.id]
  );

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
            <h1 className="text-2xl font-semibold">Welcome to MyBranz</h1>
            <p className="text-sm text-muted-foreground">
              Let's set up your organization information.
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-2">
          <Progress value={progress} className="h-2 bg-gray-300" />
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>

        <Card className={expanded ? "border-[#f23250]" : ""}>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Building2 className="h-5 w-5" color="#f23250" />
                </div>
                <div>
                  <CardTitle className="text-base">Organization</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add all information about your organization
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">{4 - progress / 25} fields left</span>
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
                      <label className="text-sm font-medium">Klaviyo Key</label>
                      <input
                        type="text"
                        className="w-full rounded-md border p-2"
                        value={formState.klaviyoKey}
                        onChange={(e) =>
                          handleInputChange("klaviyoKey", e.target.value)
                        }
                        placeholder="Enter your Klaviyo Key"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Store Location
                      </label>
                      <select
                        className="w-full rounded-md border p-2"
                        value={formState.countryCode}
                        onChange={(e) =>
                          handleInputChange("countryCode", e.target.value)
                        }
                      >
                        <option value="">Select a country</option>
                        {getCodes().map((code) => (
                          <option key={code} value={code}>
                            {getName(code)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Store Domain
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border p-2"
                        value={formState.domain}
                        onChange={(e) =>
                          handleInputChange("domain", e.target.value)
                        }
                        placeholder="apple.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Logo</label>
                      {!logoObjectKey && !imageUploading && (
                        <input
                          type="file"
                          className="w-full rounded-sm px-2 py-2 border-black border text-sm bg-gray-100"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      )}
                      {imageUploading && (
                        <RiLoader4Fill className="animate-spin text-black" />
                      )}
                      {logoObjectKey && (
                        <div className="flex items-center gap-2">
                          <CustomImage
                            objectKey={logoObjectKey}
                            store={store}
                            imageLoading={(loading) =>
                              setImageUploading(loading)
                            }
                            width="100px"
                            height="100px"
                          />
                          <FaUndo
                            className="cursor-pointer border p-1 border-gray-400 rounded-sm"
                            fontSize="25px"
                            onClick={() => setLogoObjectKey(null)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="bg-[#f23250] text-white hover:bg-[#d92b45]"
                        disabled={progress < 50}
                        onClick={handleOnboarding}
                      >
                        <RiLoader4Fill
                          className={`text-[#fff] ${
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

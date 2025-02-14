"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  Suspense,
} from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar/page";
import Sidebar from "@/components/sidebar/page";
import ProductModal from "@/components/productModal/page";
import Dropdown from "@/components/dropdownoptions/page";
import TemplateModal from "@/components/templateModal/page";
import AIModal from "@/components/aiModal/page";
import FeatureModal from "@/components/featureModal/page";
import ImageUploadModal from "@/components/imageUploadModal/page";
import DropdownChooseProducts from "@/components/dropdownchooseproducts/page";
import ImagesModal from "@/components/imagesModal/page";
import Header from "../email/Dashboard/Header";
import Link from "next/link";
import { GlobalContext } from "@/context/GlobalContext";
import generatePreviewHtml from "@/components/EmailEditor/utils/generatePreviewHtml";
import { emailTemplates } from "../api/admin/templates/defaultBlockList";
import PreviewTemplate from "../email/Dashboard/PreviewTemplate";
import BigPreviewTemplate from "../email/Dashboard/BigPreviewTemplate";
import { FaCircleCheck } from "react-icons/fa6";
import { GrMagic } from "react-icons/gr";
import { PiMagicWandDuotone } from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { cn } from "./../../lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Lottie from "react-lottie";
import * as animationData from "./animation.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomLayout from "../layout/layout";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import crypto from "crypto-js";
import { getSignedUrlCf } from "../../lib/s3";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

function encryptApiKey(apiKey) {
  const nonce = Date.now().toString(); // Could also use crypto.randomBytes
  const apiKeyWithNonce = `${nonce}:${apiKey}`;
  const encrypted = crypto.AES.encrypt(
    apiKeyWithNonce,
    process.env.NEXT_PUBLIC_SECRET
  ).toString();
  return { encrypted, nonce };
}

const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

const fetchTemplates = async ({ pageParam = 1, queryKey }) => {
  const [, { search, limit, sortBy }] = queryKey;

  const params = new URLSearchParams();
  params.append("page", pageParam);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (sortBy?.length) params.append("sortBy", sortBy.join(","));

  const response = await fetch(
    `/api/admin/templates/get-templates-paginated?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  return response.json();
};

const EmailBuilding = ({ session, store, campaign }) => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const searchParams = useSearchParams("step");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [publishingUpdate, setPublishingUpdate] = useState(false);
  const [publishingEmail, setPublishingEmail] = useState(false);
  const [published, setPublished] = useState(false);
  const totalPages = 4;

  const emailEditorRef = useRef(null);
  const [emailData, setEmailData] = useState(null);
  const [language, setLanguage] = useState("en");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [logoGeneration, setLogoGeneration] = useState(null);
  const [date, setDate] = useState();
  const [cache, setCache] = useState({});
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState(null);
  // const [dbEmailTemplates, setDbEmailTemplates] = useState([]);

  const [customCampaign, setCustomCampaign] = useState(
    !campaign ? true : false
  );

  // Fetch templates query

  const {
    data: dbEmailTemplates,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "templates",
      { search: templateSearch, limit: 10, sortBy: selectedTags },
    ],
    queryFn: fetchTemplates,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  useEffect(() => {
    if (dbEmailTemplates?.pages) {
      setAllTags(dbEmailTemplates.pages[0]);
    }
  }, [dbEmailTemplates]);

  const handleTagCheckboxChange = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
    refetch();
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch("/api/admin/templates/get-templates");
  //     const data = await response.json();
  //     setDbEmailTemplates(data);
  //   }

  //   if (currentPage == 2) {
  //     fetchData();
  //   }
  // }, [currentPage]);

  const handleCacheUpdate = (key, value) => {
    setCache((prevCache) => ({ ...prevCache, [key]: value }));
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const {
    genEmailData,
    setGenEmailDataFunc,
    setSegments,
    segments,
    setSelectedSegments,
    selectedSegments,
    setKlaviyoList,
    selectedKlaviyoList,
    setSelectedKlaviyoList,
    excludedSegments,
    setExcludedSegments,
    selectedHtml,
    selectedJson,
  } = useContext(GlobalContext);

  async function fetchImageUrl(objectKey, cache) {
    if (cache[objectKey]) {
      return cache[objectKey];
    } else {
      try {
        const response = await fetch(
          `${baseURL}/${mediaEndpoint.replace(/%s/, objectKey)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          handleCacheUpdate(objectKey, imageUrl); // Update the cache with the new image URL
          return imageUrl;
        } else {
          throw new Error("Failed to fetch image");
        }
      } catch (error) {
        handleCacheUpdate(objectKey, null); // Cache a null value if fetching fails
        console.error("Error fetching image:", error);
        return null;
      }
    }
  }

  useEffect(() => {
    async function getImg() {
      const signedUrl = await getSignedUrlCf(
        store?.mediaObjectKey,
        store?.id,
        "10years"
      );
      setLogoGeneration(signedUrl);
    }

    if (store?.mediaObjectKey) {
      getImg();
    }
  }, [store]);

  const handleCheckboxChange = (segment) => {
    setSelectedSegments((prevSelected) => {
      if (prevSelected.some((s) => s.id === segment.id)) {
        // Remove segment if already selected
        return prevSelected.filter((s) => s.id !== segment.id);
      } else {
        // Add segment if not already selected
        return [...prevSelected, segment];
      }
    });
  };

  const handleExludedList = (segment) => {
    setExcludedSegments((prevSelected) => {
      if (prevSelected.some((s) => s.id === segment.id)) {
        // Remove segment if already selected
        return prevSelected.filter((s) => s.id !== segment.id);
      } else {
        // Add segment if not already selected
        return [...prevSelected, segment];
      }
    });
  };

  function isNextDisabled(step) {
    if (!store?.klaviyoKey) {
      return true;
    }
    const onStep = Number(step);
    if (onStep == 1) {
      // Check if campaign name is  filled & more than 3 characters
      if (customCampaign) {
        if (
          genEmailData.campaignName.length > 3 &&
          genEmailData.campaignType.length > 3 &&
          genEmailData.campaignDescription.length > 5
        ) {
          return false;
        }
      } else if (genEmailData.campaignName.length > 3) {
        return false;
      }

      return true;
    }
  }

  // const blockList = emailTemplates[1].template
  // const previewHtml = generatePreviewHtml(blockList);

  function getHtml(blocklist) {
    return generatePreviewHtml(blocklist);
  }

  useEffect(() => {
    if (session && store) {
      setGenEmailDataFunc((prev) => ({
        ...prev,
        senderName: store.name,
        senderEmail: store.email,
        replyToEmail: store.email,
        storeDomain: store.domain,
        storeLogo: store.mediaObjectKey,
        socialLinks: store.socials,
        shipping: store.shipping,
      }));
    }
  }, [session]);

  useEffect(() => {
    if (searchParams.get("step")) {
      const step = 4;
      setCurrentPage(Number(step));
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedProduct.length > 0) {
      let products = selectedProduct.map((product) => ({
        ...product,
        image: product.featuredImage ? product.featuredImage.url : null,
        linkText: "SHOP NOW",
        link: product.onlineStorePreviewUrl,
      }));

      // Only update if the products array is different
      if (JSON.stringify(products) !== JSON.stringify(selectedProduct)) {
        setSelectedProduct(products);
      }
    }

    // Update genEmailDataFunc
    setGenEmailDataFunc((prev) => ({
      ...prev,
      products: selectedProduct,
    }));
  }, [selectedProduct]);

  useEffect(() => {
    async function fetchData() {
      if (!store?.klaviyoKey) {
        console.log("Klaviyo Key not found");
        return;
      }

      const { encrypted, nonce } = encryptApiKey(store?.klaviyoKey);
      const [segmentsResponse, audienceResponse] = await Promise.all([
        fetch("/api/klaviyo/getsegments", {
          method: "GET",
          headers: {
            Authorization: `${encrypted}`,
            Xauth: `${nonce}`,
            "Content-Type": "application/json",
          },
        }),
        fetch("/api/klaviyo/getaudience", {
          method: "GET",
          headers: {
            Authorization: `${encrypted}`,
            Xauth: `${nonce}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      const segmentsData = await segmentsResponse.json();
      const audienceData = await audienceResponse.json();

      // Combine the data without duplication
      const combinedData = [...segmentsData.data, ...audienceData.data];

      // Use a Set to remove duplicates based on segment ID
      const uniqueSegments = Array.from(
        new Set(combinedData.map((item) => item.id))
      ).map((id) => combinedData.find((item) => item.id === id));

      setSegments(uniqueSegments);
    }

    if (segments.length === 0) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setEmailData([]);
    }, 300);
  }, []);

  const handleJsonUpload = (json) => {
    setEmailData(json);
  };

  const closeDialog = () => setDialogOpen(false);

  async function generateEmail() {
    setGeneratingEmail(true);

    try {
      // Call Mybranz API
      const response = await fetch(
        "https://dev.mybranzapi.link/v1/email_generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brandScrapedData: store?.about ? store?.about : "NO DATA",
            productTitle: selectedProduct[0]?.title,
            productDescription: "",
            emailType: genEmailData.campaignType,
            campaignDescription: genEmailData.campaignDescription,
            discountCode: genEmailData?.discount,
          }),
        }
      );

      if (!response.ok) {
        console.log("Error while fetching data from Mybranz API");
        return;
      }

      const data = await response.json();
      console.log("API DATA", data);

      setGenEmailDataFunc((prev) => ({
        ...prev,
        discount: data?.emailCampaign.discount,
        introductoryText: data?.emailCampaign?.introductoryText,
        subTitle: data?.emailCampaign?.subtitle,
        subject: data?.emailCampaign?.fomo,
        Fomo: data?.emailCampaign?.FOMO,
        services: data?.emailCampaign?.services,
        shipping: data?.emailCampaign?.shipping,
        synopsis: data?.emailCampaign?.synopsis,
        tagline: data?.emailCampaign?.tagline,
      }));

      // Create a timeout that resolves after 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Get Rest of the data from API (simulated here)
      const dataFromApi = {
        logo: logoGeneration,
        banner: selectedProduct[0]?.featuredImage
          ? selectedProduct[0]?.featuredImage.url
          : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
        companyInfo: "Copyright 2024",
      };

      // Combine both data
      setGenEmailDataFunc((prev) => ({
        ...prev,
        ...dataFromApi,
      }));

      setGeneratingEmail(false);

      router.push(`/email-editor?template=${selectedTemplateId}`);
    } catch (error) {
      console.log(error);
    }
  }

  async function publishEmail() {
    if (!store?.klaviyoKey) {
      console.log("Klaviyo Key not found");
      return;
    }

    const { encrypted, nonce } = encryptApiKey(store?.klaviyoKey);

    let campaignId = null;
    let campaignIdForSendingEmail = null;
    let templateId = null;
    try {
      // STEPS
      //1. Create Campaign
      //2. Create Template
      //3. Assign Template to Campaign

      // Create Campaign
      setPublishingUpdate("Creating Campaign");
      setPublishingEmail(true);
      const campaignResponse = await fetch("/api/klaviyo/createcampaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${encrypted}`,
          Xauth: `${nonce}`,
        },
        body: JSON.stringify({
          selectedSegments,
          excludedSegments,
          date,
          subject: genEmailData.subject,
          senderName: genEmailData.senderName,
          senderEmail: genEmailData.senderEmail,
          replyToEmail: genEmailData.replyToEmail,
          campaignName: genEmailData.campaignName,
        }),
      });

      const campaignData = await campaignResponse.json();

      if (campaignData.data) {
        campaignIdForSendingEmail = campaignData.data.id;
        campaignId =
          campaignData?.data?.relationships["campaign-messages"]?.data[0]?.id;
      }

      if (!campaignResponse.ok) {
        setPublishingUpdate("Something went wrong while creating the campaign");
      }

      if (campaignId && campaignResponse.ok) {
        // Create Template
        setPublishingUpdate("Creating Template");
        const templateResponse = await fetch("/api/klaviyo/createTemplate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${encrypted}`,
            Xauth: `${nonce}`,
          },
          body: JSON.stringify({
            selectedHtml: selectedHtml,
            campaignName: genEmailData.campaignName,
          }),
        });

        const templateData = await templateResponse.json();

        if (templateData.data) {
          templateId = templateData.data.id;
        }

        if (!templateResponse.ok) {
          setPublishingUpdate(
            "Something went wrong while creating the template"
          );
        }

        if (templateResponse.ok) {
          // Assign Template to Campaign
          setPublishingUpdate("Assigning Template to Campaign");

          const assignTemplateResponse = await fetch(
            "/api/klaviyo/assignTemplate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${encrypted}`,
                Xauth: `${nonce}`,
              },
              body: JSON.stringify({
                campaignId: campaignId,
                templateId: templateId,
              }),
            }
          );

          if (!assignTemplateResponse.ok) {
            setPublishingUpdate(
              "Something went wrong while assigning the template to the campaign"
            );
          }

          if (assignTemplateResponse.ok) {
            setPublishingUpdate("Saving Campaign");
            const saveCampaign = await fetch("/api/klaviyo/save-campaign", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                klaviyoCampaignId: campaignIdForSendingEmail,
                genEmailData: genEmailData,
                htmlEmailTemplate: selectedHtml,
                jsonEmailTemplate: selectedJson,
                storeId: store.id,
              }),
            });

            if (!saveCampaign.ok) {
              setPublishingUpdate(
                "Something went wrong while saving the email"
              );
            }

            setPublishingUpdate("Scheduling Campaign");
            const sendEmail = await fetch("/api/klaviyo/send-campaign", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${encrypted}`,
                Xauth: `${nonce}`,
              },
              body: JSON.stringify({ campaignID: campaignIdForSendingEmail }),
            });

            if (!sendEmail.ok) {
              setPublishingUpdate(
                "We could not schedule/publish your email. But it has been saved as draft in Klaviyo."
              );
              setPublished(true);
            } else {
              setPublishingUpdate("Email Published Successfully");
              setPublished(true);
            }
          }
        }
      }

      setPublishingEmail(false);
    } catch (error) {
      console.log(error);
    }
  }

  const post = [
    { title: "Campaign Type", step: "1" },
    { title: "Products", step: "2" },
    { title: "Select Template", step: "3" },
    { title: "Schedule", step: "4" },
  ];

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClose = () => setShowTemplate(false);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    handleClose();
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setShowTemplate(true);
  };

  const handleSelectOption2 = (option) => {
    setSelectedOption2(option);
    setShowTemplate(true);
  };

  const renderModal = () => {
    switch (selectedOption) {
      case "Choose Products":
        return (
          showTemplate && (
            <ProductModal handleProductSelect={handleProductSelect} />
          )
        );
      case "Choose Images":
        return (
          showTemplate && (
            <ImagesModal handleProductSelect={handleProductSelect} />
          )
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="w-full">
            <div className="row">
              <div className=" w-full">
                <div className="steps mt-0">
                  <ul className="flex justify-between items-center list-unstyled mb-4">
                    {post.map((step, index) => (
                      <>
                        <li
                          key={index}
                          className={`flex flex-col  items-center step text-center ${
                            index === currentPage - 1 ? "active" : ""
                          }`}
                        >
                          <p
                            className={`${
                              index === currentPage - 1
                                ? "step_num"
                                : "step_num_border"
                            }`}
                          >
                            <FaCircleCheck
                              fontSize={18}
                              className={`${
                                index < currentPage - 1 ||
                                index === currentPage - 1
                                  ? " text-red-500"
                                  : "text-gray-300"
                              }`}
                            />
                          </p>
                          <p
                            className="text-dark font-bold"
                            style={{ fontSize: 14 }}
                          >
                            {step.title}
                          </p>
                        </li>
                      </>
                    ))}
                  </ul>
                </div>

                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${((currentPage - 1) / (totalPages - 1)) * 100}%`,
                    }}
                    aria-valuenow={((currentPage - 1) / (totalPages - 1)) * 100}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                {currentPage === 1 && (
                  <div className="custom-card border mt-5 mx-auto p-5">
                    {!customCampaign && (
                      <div className="w_input_steps mx-auto mb-5">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                          style={{ fontSize: 14 }}
                        >
                          {" "}
                          Campaign Type{" "}
                        </label>
                        <input
                          type="text"
                          className="w-100 px-2 py-2 border-gray-200 border  bg-gray-100"
                          style={{ fontSize: 14 }}
                          id="storeName"
                          placeholder={
                            customCampaign
                              ? "Custom Campaign"
                              : campaign["Campaign Type"]
                              ? campaign["Campaign Type"]
                              : "Custom Campaign"
                          }
                          disabled
                        />
                        <span
                          className="text-sm underline cursor-pointer "
                          onClick={() => setCustomCampaign(!customCampaign)}
                        >
                          Create a Custom Campaign Instead
                        </span>
                      </div>
                    )}

                    {customCampaign && (
                      <div className="w_input_steps mx-auto mb-5">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                          style={{ fontSize: 14 }}
                        >
                          {" "}
                          Campaign Type{" "}
                        </label>
                        <input
                          type="text"
                          className="w-100 px-2 py-2 border-black border  bg-gray-100"
                          style={{ fontSize: 14 }}
                          id="storeName"
                          placeholder="Newsletter"
                          value={genEmailData.campaignType}
                          onChange={(e) =>
                            setGenEmailDataFunc((prevData) => ({
                              ...prevData,
                              campaignType: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}

                    {customCampaign && (
                      <div className="w_input_steps mx-auto mb-5">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                          style={{ fontSize: 14 }}
                        >
                          {" "}
                          Campaign Description{" "}
                        </label>
                        <input
                          type="text"
                          className="w-100 px-2 py-2 border-black border  bg-gray-100"
                          style={{ fontSize: 14 }}
                          id="storeName"
                          placeholder="Monthly Newsletter - September Highlights"
                          value={genEmailData.campaignDescription}
                          onChange={(e) =>
                            setGenEmailDataFunc((prevData) => ({
                              ...prevData,
                              campaignDescription: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}

                    {/* <div className="w_input_steps mx-auto mb-5">
                      <label
                        htmlFor="storeName"
                        className="form-label font-bold"
                        style={{ fontSize: 14 }}
                      >
                        Campaign Type
                      </label>
                      <input
                        type="text"
                        className="w-100 px-2 py-2 border-[#ea304d] border  bg-gray-100"
                        style={{ fontSize: 14 }}
                        id="storeName"
                        placeholder={
                          campaign["Campaign Type"]
                            ? campaign["Campaign Type"]
                            : "Custom Campaign"
                        }
                        disabled
                      />
                    </div> */}

                    <div className="w_input_steps mx-auto">
                      <label
                        htmlFor="storeName"
                        className="form-label font-bold"
                        style={{ fontSize: 14 }}
                      >
                        {" "}
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={genEmailData?.campaignName}
                        className="w-100 px-2 py-2 border-black border  bg-gray-100"
                        id="storeName"
                        style={{ fontSize: 14 }}
                        placeholder="June EOM Campaign"
                        onChange={(e) =>
                          setGenEmailDataFunc((prevData) => ({
                            ...prevData,
                            campaignName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                {currentPage === 2 && (
                  <div className="custom-card mx-auto p-5">
                    <div className="w_input_steps position-relative mx-auto mb-5">
                      <label
                        htmlFor="storeName"
                        className="form-label font-bold"
                      >
                        Product(s)
                      </label>
                      <div className="flex">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <div
                            onClick={() => setDialogOpen(true)}
                            className=" cursor-pointer w-100 bg-gray-100 border border-gray-500 p-2 text-gray-500 w-full"
                          >
                            <DialogTrigger>Select Products</DialogTrigger>
                          </div>
                          <DialogContent className="max-w-[50%]">
                            <DialogHeader>
                              <DialogTitle>Select Products</DialogTitle>
                              <DialogDescription>
                                <ProductModal
                                  handleProductSelect={handleProductSelect}
                                  closeDialog={closeDialog}
                                  storeId={store?.id}
                                  userType={
                                    session?.user?.shopifyStoreId
                                      ? "shopify"
                                      : "custom"
                                  }
                                  selectedProducts={selectedProduct}
                                  shopifyStoreId={session?.user?.shopifyStoreId}
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="w_input_steps position-relative mx-auto mb-5">
                      <label
                        htmlFor="storeName"
                        className="form-label font-bold"
                      >
                        Discount Code (optional)
                      </label>
                      <div className="flex relative">
                        <input
                          type="text"
                          className="form-control border-dark w-full"
                          placeholder="TRY50"
                          onChange={(e) =>
                            setGenEmailDataFunc((prevData) => ({
                              ...prevData,
                              discount: e.target.value,
                            }))
                          }
                        />
                        <Image
                          src="/Discount.svg"
                          alt="Vercel Logo"
                          className="dark:invert absolute end-0 me-3 mt-1"
                          width={30}
                          height={30}
                          priority
                        />
                      </div>
                    </div>

                    <div className="w_input_steps position-relative mx-auto mb-5">
                      <label
                        htmlFor="storeName"
                        className="form-label font-bold"
                      >
                        Sender Name
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={genEmailData?.senderName}
                          className="form-control border-dark w-100"
                          placeholder="Apple Inc"
                          onChange={(e) =>
                            setGenEmailDataFunc((prevData) => ({
                              ...prevData,
                              senderName: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="w_input_steps position-relative mx-auto mb-5">
                      <label
                        htmlFor="storeName"
                        className="form-label font-bold"
                      >
                        Sender Email
                      </label>
                      <div className="flex">
                        <input
                          type="email"
                          value={genEmailData?.senderEmail}
                          className="form-control border-dark w-100"
                          placeholder="steve@apple.com"
                          onChange={(e) =>
                            setGenEmailDataFunc((prevData) => ({
                              ...prevData,
                              senderEmail: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="w_input_steps position-relative mx-auto mb-5">
                      <label
                        htmlFor="storeName"
                        className="form-label font-bold"
                      >
                        Reply-to-Email
                      </label>
                      <div className="flex">
                        <input
                          type="email"
                          value={genEmailData?.replyToEmail}
                          className="form-control border-dark w-100"
                          placeholder="no-reply@apple.com"
                          onChange={(e) =>
                            setGenEmailDataFunc((prevData) => ({
                              ...prevData,
                              replyToEmail: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* <div className="w_input_steps position-relative mx-auto">
                      <label htmlFor="storeName" className="form-label font-bold">
                        Duration of the Sale (optional)
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          className="form-control border-dark w-100"
                          placeholder=""
                        />
                        <Image
                          src="/Timesheet.svg"
                          alt="Vercel Logo"
                          className="dark:invert position-absolute end-0 me-3 mt-1"
                          width={30}
                          height={30}
                          priority
                        />
                      </div>
                    </div> */}
                  </div>
                )}

                {currentPage === 3 && (
                  <>
                    <Dialog open={generatingEmail}>
                      <div className=""></div>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crafting Your Perfect Email</DialogTitle>
                          <DialogDescription className="flex justify-center items-center flex-col">
                            <div className="flex flex-col space-y-3">
                              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                              </div>
                            </div>
                            <div className="magic-icon-wrapper w-full h-full flex items-center justify-center">
                              <PiMagicWandDuotone
                                size="80px"
                                className="-mt-14"
                              />
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <div className="flex mt-6 justify-start items-start">
                      <div className="w-[60%] flex flex-col">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="w-full p-2 border mb-4 rounded"
                            placeholder="Search Templates"
                            value={templateSearch}
                            onChange={(e) => {
                              setTemplateSearch(e.target.value);
                              refetch();
                            }}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                Select Brand Tags
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>Brand Tags</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {allTags &&
                                allTags?.brandTags.map((tag) => {
                                  if (
                                    tag !== null &&
                                    tag !== undefined &&
                                    tag !== ""
                                  ) {
                                    return (
                                      <DropdownMenuItem
                                        key={tag}
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={tag}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() =>
                                              handleTagCheckboxChange(tag)
                                            }
                                          />
                                          <label
                                            htmlFor={tag}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {tag}
                                          </label>
                                        </div>
                                      </DropdownMenuItem>
                                    );
                                  }
                                })}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                Select Campaign Type Tags
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>
                                Campaign Tags
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {allTags &&
                                allTags?.campaignTypeTags.map((tag) => {
                                  if (
                                    tag !== null &&
                                    tag !== undefined &&
                                    tag !== ""
                                  ) {
                                    return (
                                      <DropdownMenuItem
                                        key={tag}
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={tag}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() =>
                                              handleTagCheckboxChange(tag)
                                            }
                                          />
                                          <label
                                            htmlFor={tag}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {tag}
                                          </label>
                                        </div>
                                      </DropdownMenuItem>
                                    );
                                  }
                                })}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                Select Industry Tags
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>
                                Industry Tags
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {allTags &&
                                allTags?.industryTags.map((tag) => {
                                  if (
                                    tag !== null &&
                                    tag !== undefined &&
                                    tag !== ""
                                  ) {
                                    return (
                                      <DropdownMenuItem
                                        key={tag}
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={tag}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() =>
                                              handleTagCheckboxChange(tag)
                                            }
                                          />
                                          <label
                                            htmlFor={tag}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {tag}
                                          </label>
                                        </div>
                                      </DropdownMenuItem>
                                    );
                                  }
                                })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="w-full flex flex-wrap gap-[20px] max-h-[100vh] overflow-y-auto">
                          {dbEmailTemplates &&
                            dbEmailTemplates.pages[0].templates.map(
                              (template, index) => (
                                <div
                                  onClick={(e) =>
                                    setSelectedTemplateId(template.id)
                                  }
                                  key={index}
                                  className="template-container relative group cursor-pointer"
                                >
                                  <div
                                    className={`${
                                      selectedTemplateId == template.id
                                        ? "opacity-65"
                                        : "opacity-0"
                                    } absolute top-0 right-0 bg-black z-30 w-full h-full flex items-center justify-center cursor-pointer`}
                                  >
                                    <FaCircleCheck
                                      size="40px"
                                      color="#ff272b"
                                    />
                                  </div>
                                  <PreviewTemplate
                                    key={index}
                                    htmlTemplate={template.html}
                                  />
                                  <p className="flex items-center justify-center mt-2">
                                    Template ID: {template.id}
                                  </p>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                      <div className="w-[40%] ">
                        {/* {From Selected Template id show the preview} */}
                        {selectedTemplateId &&
                        dbEmailTemplates?.pages &&
                        selectedTemplateId ? (
                          <BigPreviewTemplate
                            htmlTemplate={
                              dbEmailTemplates?.pages[0].templates.find(
                                (template) => template.id === selectedTemplateId
                              )?.html
                            }
                          />
                        ) : (
                          <div className="flex flex-col h-[100vh] px-4">
                            <Skeleton className="w-full h-[200px]" />
                            <Skeleton className="w-full h-[20px] mt-2" />
                            <Skeleton className="w-full h-[20px] mt-2" />
                            <Skeleton className="w-full h-[20px] mt-2" />
                            <Skeleton className="w-full h-[20px] mt-2" />
                            <div className="flex justify-center items-center gap-2">
                              <Skeleton className="w-full h-[400px] mt-2" />
                              <Skeleton className="w-full h-[400px] mt-2" />
                            </div>
                            <Skeleton className="w-full h-[100px] mt-2" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between my-5">
                      <IoMdArrowDropleftCircle size={40} onClick={prevPage} />
                      <button
                        disabled={selectedTemplateId == null}
                        className={`${
                          selectedTemplateId == null
                            ? "opacity-50"
                            : "opacity-100"
                        } btn btn-dark border_btn px-3 cursor-pointer`}
                        onClick={() => generateEmail()}
                      >
                        Generate Email{" "}
                      </button>
                    </div>
                  </>
                )}

                {currentPage === 4 && (
                  <>
                    <Dialog open={published}>
                      <div className=""></div>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Campaign Created</DialogTitle>
                          <DialogDescription className="flex justify-center items-center flex-col">
                            <div className="my-3">
                              <p className="text-black">{publishingUpdate}</p>
                            </div>
                            <div className="flex items-end justify-end gap-2 w-full">
                              <button
                                className="btn border-black border_btn px-3"
                                onClick={() =>
                                  window.open(
                                    "https://www.klaviyo.com/campaigns/list",
                                    "_blank"
                                  )
                                }
                              >
                                Open in Klaviyo
                              </button>
                              <button
                                className="btn btn-dark border_btn px-3"
                                onClick={() => router.push("/calendar")}
                              >
                                Close
                              </button>
                            </div>
                            <div className="magic-icon-wrapper w-full h-full flex items-center justify-center"></div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <div className="custom-card border mt-5 mx-auto p-5">
                      <div className="w_input_steps mx-auto">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                          style={{ fontSize: 14 }}
                        >
                          {" "}
                          Campaign Name
                        </label>
                        <input
                          type="text"
                          value={genEmailData?.campaignName}
                          className="w-100 px-2 py-2 border-black border  bg-gray-100"
                          id="storeName"
                          style={{ fontSize: 14 }}
                          placeholder="June EOM Campaign"
                          onChange={(e) =>
                            setGenEmailDataFunc((prevData) => ({
                              ...prevData,
                              campaignName: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="w_input_steps position-relative mx-auto mt-4">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                        >
                          Subject Line
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            value={genEmailData?.subject}
                            className="form-control border-dark w-100"
                            placeholder="Summer Sale has Started!"
                            onChange={(e) =>
                              setGenEmailDataFunc((prevData) => ({
                                ...prevData,
                                subject: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="w_input_steps mx-auto  mt-4">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                          style={{ fontSize: 14 }}
                        >
                          {" "}
                          Campaign Date
                        </label>
                        <Popover className="bg-gray-100 w-100 px-2 py-2 border-black border">
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[450px] justify-start text-left font-normal bg-gray-100 rounded-lg border-black border",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              disabled={(date) => date < today}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="w_input_steps mx-auto">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold mt-4"
                          style={{ fontSize: 14 }}
                        >
                          Customer Segment
                        </label>
                        <Popover>
                          <PopoverTrigger className="w-100 px-2 text-left text-gray-400 py-2 border-black border rounded-md bg-gray-100">
                            <div className="text-sm">
                              {selectedSegments.length > 0
                                ? selectedSegments.map((segment, index) => (
                                    <div
                                      key={index}
                                      className="bg-white m-1 p-1 rounded text-gray-500 inline-block"
                                    >
                                      {segment.attributes.name}
                                    </div>
                                  ))
                                : "Open"}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-[450px] h-[300px] overflow-y-auto">
                            {segments &&
                              segments.length > 0 &&
                              segments.map((segment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-start gap-2 text-md w-full"
                                >
                                  <input
                                    type="checkbox"
                                    id={segment.id}
                                    name={segment.attributes.name}
                                    value={segment.id}
                                    checked={selectedSegments.some(
                                      (s) => s.id === segment.id
                                    )}
                                    disabled={excludedSegments.some(
                                      (s) => s.id === segment.id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(segment)
                                    }
                                  />
                                  <label htmlFor={segment.id}>
                                    {segment.attributes.name}
                                  </label>
                                </div>
                              ))}
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="w_input_steps mx-auto">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold mt-4"
                          style={{ fontSize: 14 }}
                        >
                          Exclude Segment
                        </label>
                        <Popover>
                          <PopoverTrigger className="w-100 px-2 text-left text-gray-400 py-2 border-black border rounded-md bg-gray-100">
                            <div className="text-sm">
                              {excludedSegments.length > 0
                                ? excludedSegments.map((segment, index) => (
                                    <div
                                      key={index}
                                      className="bg-white m-1 p-1 rounded text-gray-500 inline-block"
                                    >
                                      {segment.attributes.name}
                                    </div>
                                  ))
                                : "Open"}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-[450px] h-[300px] overflow-y-auto">
                            {segments &&
                              segments.length > 0 &&
                              segments.map((segment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-start gap-2 text-md w-full"
                                >
                                  <input
                                    type="checkbox"
                                    id={segment.id}
                                    name={segment.attributes.name}
                                    value={segment.id}
                                    checked={excludedSegments.some(
                                      (s) => s.id === segment.id
                                    )}
                                    disabled={selectedSegments.some(
                                      (s) => s.id === segment.id
                                    )}
                                    onChange={() => handleExludedList(segment)}
                                  />
                                  <label htmlFor={segment.id}>
                                    {segment.attributes.name}
                                  </label>
                                </div>
                              ))}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Dialog open={publishingEmail}>
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
                                    rendererSettings: {
                                      preserveAspectRatio: "xMidYMid slice",
                                    },
                                  }}
                                  height={400}
                                  width={400}
                                />
                              </div>
                              <div>
                                {publishingUpdate !== false ? (
                                  <p className="flex items-center gap-4 text-base">
                                    <AiOutlineLoading3Quarters className="spinner" />
                                    {publishingUpdate}
                                  </p>
                                ) : null}
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className=" flex justify-end">
                      <button
                        className="btn btn-dark border_btn px-3"
                        onClick={() => publishEmail()}
                      >
                        Publish Email{" "}
                      </button>
                    </div>
                  </>
                )}

                {/* {currentPage === 4 && (
                  <>
                    <div className="custom-card-skin-care mx-auto pt-4 px-5">
                      <div className="w_input_steps position-relative mb-5">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                        >
                          Campaign Date
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            className="form-control border-dark w-100"
                            placeholder=""
                          />
                          <Image
                            src="/Calendar.svg"
                            alt="Vercel Logo"
                            className="dark:invert position-absolute end-0 me-3 mt-1"
                            width={30}
                            height={30}
                            priority
                          />
                        </div>
                      </div>

                      <div className="w_input_steps position-relative">
                        <label
                          htmlFor="storeName"
                          className="form-label font-bold"
                        >
                          Time
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            className="form-control border-dark w-100"
                            placeholder=""
                          />
                          <Image
                            src="/Clock.svg"
                            alt="Vercel Logo"
                            className="dark:invert position-absolute end-0 me-3 mt-1"
                            width={30}
                            height={30}
                            priority
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-content-end my-5">
                      <button className="btn btn-dark border_btn px-3" onClick={nextPage}> Generate Email </button>
                    </div>
                  </>
                )} */}

                {currentPage !== totalPages && currentPage !== 3 && (
                  <div className="flex justify-between my-5">
                    <IoMdArrowDropleftCircle
                      disabled={currentPage == 1}
                      size={40}
                      className={`${
                        currentPage == 1 ? "opacity-50" : "opacity-100"
                      } cursor-pointer`}
                      onClick={prevPage}
                    />
                    <button
                      disabled={isNextDisabled(currentPage)}
                      className="px-5 bg-black text-white rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
                      onClick={nextPage}
                    >
                      {" "}
                      Next{" "}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EmailBuildingWrapper = ({ session, store, campaign }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomLayout>
        <EmailBuilding session={session} store={store} campaign={campaign} />
      </CustomLayout>
    </Suspense>
  );
};

export default EmailBuildingWrapper;

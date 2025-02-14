"use client";

import React, {
  useEffect,
  useState,
  useContext,
  Suspense,
  useRef,
  useCallback,
} from "react";
import TopolEditor from "@topol.io/editor-react";
import { TopolPlugin } from "@topol.io/editor-react";
import { useSearchParams, useRouter } from "next/navigation";
import { GlobalContext } from "@/context/GlobalContext";
import Header from "./Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { select } from "@nextui-org/theme";
import { RiLoader4Fill } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchAssetsList } from "@/network/APIService";
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tab";
import { getImages } from "../../lib/s3";
import toast, { Toaster } from "react-hot-toast";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { IoMdMenu } from "react-icons/io";

// export const useMultiImageUpload = () => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadedObjectKeys, setUploadedObjectKeys] = useState([]);

//   const uploadFile = async (file, storeId) => {
//     // Create an ArrayBuffer from the file
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = new Uint8Array(arrayBuffer);

//     // Send the buffer to the server
//     const response = await fetch(`/api/admin/user/upload-image`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/octet-stream",
//         "File-Name": file.name,
//         Mimetype: file.type,
//         Store: storeId,
//       },
//       body: buffer,
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     return response.json();
//   };

//   const handleMultipleImageUpload = useCallback(async (e, storeId) => {
//     setIsUploading(true);
//     setUploadedObjectKeys([]);

//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     const uploadedKeys = [];

//     try {
//       for (const file of files) {
//         try {
//           const response = await uploadFile(file, storeId);
//           if (response.success && response.data.objectKey) {
//             uploadedKeys.push(response.data.objectKey);
//             toast.success(`Uploaded: ${file.name}`);
//           } else {
//             toast.error(`Upload Failed: ${file.name}`);
//           }
//         } catch (error) {
//           console.error(`Error uploading ${file.name}:`, error);
//           toast.error(`Upload Failed: ${file.name}`);
//         }
//       }

//       setUploadedObjectKeys(uploadedKeys);
//       return {
//         success: uploadedKeys.length > 0,
//         objectKeys: uploadedKeys.length > 0 ? uploadedKeys : null,
//       };
//     } catch (error) {
//       console.error("Multiple upload error:", error);
//       toast.error("Multiple upload failed");
//       return {
//         success: false,
//         objectKeys: null,
//       };
//     } finally {
//       setIsUploading(false);
//     }
//   }, []);

//   const resetUpload = () => {
//     setUploadedObjectKeys([]);
//   };

//   return {
//     handleMultipleImageUpload,
//     isUploading,
//     uploadedObjectKeys,
//     resetUpload,
//   };
// };

export const useMultiImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedObjectKeys, setUploadedObjectKeys] = useState([]);

  const uploadFile = async (file, storeId) => {
    // Create an ArrayBuffer from the file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Send the buffer to the server
    const response = await fetch(`/api/admin/user/upload-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "File-Name": file.name,
        Mimetype: file.type,
        Store: storeId,
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const handleMultipleImageUpload = useCallback(async (e, storeId) => {
    // Reset states at the start of each upload
    setIsUploading(true);
    setUploadedObjectKeys([]);

    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setIsUploading(false);
      return;
    }

    const uploadedKeys = [];

    try {
      for (const file of files) {
        try {
          const response = await uploadFile(file, storeId);
          if (response.success && response.data.objectKey) {
            uploadedKeys.push(response.data.objectKey);
            toast.success(`Uploaded: ${file.name}`);
          } else {
            toast.error(`Upload Failed: ${file.name}`);
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(`Upload Failed: ${file.name}`);
        }
      }

      setUploadedObjectKeys(uploadedKeys);
      return {
        success: uploadedKeys.length > 0,
        objectKeys: uploadedKeys.length > 0 ? uploadedKeys : null,
      };
    } catch (error) {
      console.error("Multiple upload error:", error);
      toast.error("Multiple upload failed");
      return {
        success: false,
        objectKeys: null,
      };
    } finally {
      setIsUploading(false);
    }
  }, []);

  const resetUpload = () => {
    setUploadedObjectKeys([]);
    setIsUploading(false);
  };

  return {
    handleMultipleImageUpload,
    isUploading,
    uploadedObjectKeys,
    resetUpload,
  };
};

function Page({ session, store, user }) {
  const apiOptions = {
    FEEDS: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/feeds`,
    PRODUCTS: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/feeds/products/${store.userId}`,
  };

  const TOPOL_OPTIONS = {
    authorize: {
      apiKey: "uF9XM9D0cWBNF6Dl3CrpuowrsodCcqfhH1AAFyuqTrNyYar9w3TsEZrsnzET",
      userId: 1,
    },
    customFileManager: true,
    removeTopBar: true,
    callbacks: {},
    api: apiOptions,
    apiBlocks: {
      ReviewBlock: {
        itemsURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/feeds/reviews/${user.shopifyStoreId}`,
        feedsURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/feeds`,
        name: "Review Block",
        pluralName: "Review Blocks",
        icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="34"  height="34"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>`,
        blockStructure: {
          image: {
            defaultValue:
              "https://d7dum6r51r1fd.cloudfront.net/8/16231558095-star-rating-bb8e6b00-d6ec-4a1b-8d14-b14a5cf7a10c.svg?Expires=2048512879&Key-Pair-Id=K19P7GNQEI3V4P&Signature=v-d09CBCLP0M3p7x8lbanvgHHt5BKoX-R4OEzFJV0Hs3-I6OyoBYu4BMbRg-UVSKK--VEugBTx05lJAod8GAwNuZmDA8Oxk2kZ7zhrFPZu8v6-J1Q54JLbSvKAE3fPxtFtSgjXpaijW2MhmOpwOm7Iggjj9IjUoEq6zhT8oDt7aiCLcIjQC71E2x1XsiC2q8HXwGCiyWSty1v64RMMwCIQmQDOOsGcX09cUpr3Qpn6ZOVEPXyhfFUfU0s630pZ~RjAFRCotnWCBjYgRO2eBrvTFtzwT3ppRAXqes7G9ocDo8AxqUdKmFT3dIqAPgex-0cUu6VV92puDkDWhN~fwx~A__",
            label: "Review Stars",
            width: 250,
            align: "center",
          },
          href: {
            defaultValue: "*|MY_HREF|*",
          },
          "my-text-1": {
            defaultValue:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis maximus justo, eget pellentesque nulla.",
            label: "Customer Testimonial",
            "font-size": "16px",
            color: "#000",
            "font-family": "Helvetica, Arial, sans-serif",
            "font-weight": "normal",
            "font-style": "italic",
          },
          "my-text-2": {
            defaultValue: "Lorem ipsum",
            label: "Customer Name",
            "font-size": "15px",
            color: "#000",
            "text-transform": "uppercase",
            "font-family": "Helvetica, Arial, sans-serif",
            "font-weight": "bold",
          },
          button: {
            defaultValue: "SHOP NOW",
            label: "Button",
            align: "center",
            "background-color": "#000",
            color: "#ffffff",
            "font-size": "16px",
            "font-family": "Helvetica, Arial, sans-serif",
            "font-weight": "bold",
            "text-transform": "uppercase",
            "text-decoration": "none",
            "border-radius": "3px",
            padding: "10px 20px 10px 20px",
          },
        },
      },
    },
    customBlocks: [
      {
        key: "custom-block-key",
        name: "Header",
        dialog: true,
        icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="34"  height="34"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>`,
        content: `<p style="text-align: center; font-size: 14px; font-family: Roboto, Tahoma, sans-serif; color: rgb(0, 0, 0);">
        ${
          store.menuLinks.length > 0
            ? store.menuLinks
                .map((link, index) => {
                  const separator =
                    index < store.menuLinks.length - 1 ? " | " : "";
                  return `<a href="${link.link}" style="color: rgb(0, 0, 0); margin: 0 10px;">${link.name}</a>${separator}`;
                })
                .join("")
            : ""
        }
        </p>`,
        disabled: false, //disabled button for certian users
      },
    ],
    light: true,
    theme: {
      preset: "light",
      colors: {
        900: "#fff",
        800: "#fff",
        700: "#fff",
        600: "#f1f5f9", //d
        500: "#D7D8D9",
        400: "#C9CACB",
        300: "#A4A5A7",
        200: "#8D8F92",
        100: "#727477",
        50: "#4B4C4E",
        10: "#2B2B2C",
        white: "#ffffff",
        primary: "#f23250",
        "primary-light": "#B4A0FF",
        "primary-light-2": "#DFD9FF",
        secondary: "#11CFC4",
        "secondary-light": "#00E5D8",
        "secondary-light-2": "#CEFAF8",
        error: "#C4261A",
        "error-light": "#E32F22",
        success: "#f23250",
        "success-light": "#f23250",
        active: "#f23250",
        "active-2": "#0FCE56",
        "active-3": "#FF9900",
      },
    },
  };

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    selectedHtml,
    setSelectedHtml,
    genEmailData,
    setSelectedJson,
    setGenEmailDataFunc,
  } = useContext(GlobalContext);
  const [emailData, setEmailData] = useState(null);
  const searchParams = useSearchParams();
  const [exportedHtml, setExportedHtml] = useState(null);
  const [exportedJson, setExportedJson] = useState(null);
  const [exportClicked, setExportClicked] = useState(false);
  const [exportJsonClicked, setExportJsonClicked] = useState(false);
  const [importJsonClicked, setImportJsonClicked] = useState(false);
  const [gotoNext, setGotoNext] = useState(false);
  const [fmPopup, setFmPopup] = useState(false);
  const [searchTermS3, setSearchTermS3] = useState("");
  const [searchTermShopify, setSearchTermShopify] = useState("");

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      // Set up a timer to update the debounced value after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Clean up the timer if the value changes before the delay
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTermS3, 500);

  const fetchAssetsLists = async ({ queryKey, pageParam }) => {
    const [_, shopifyStoreId] = queryKey; // Extract Shopify Store ID from the query key
    const cursor = pageParam || null; // Use pageParam for pagination (null for the first request)
    const direction = "next"; // Default direction
    return await fetchAssetsList(
      shopifyStoreId,
      cursor,
      direction,
      searchTermShopify
    );
  };

  const fetchS3AssetsNew = async ({ pageParam = 1, queryKey }) => {
    const [_, storeId, searchTermS3] = queryKey; // Extract storeId and searchTerm from queryKey
    const limit = 5;

    if (!storeId) throw new Error("storeId is required");

    const response = await fetch(
      `/api/admin/user/get-images?storeId=${storeId}&page=${pageParam}&limit=${limit}&search=${
        searchTermS3 || ""
      }`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch assets");
    }

    const data = await response.json();
    return {
      data: data.data,
      nextPage: pageParam < data.pagination.totalPages ? pageParam + 1 : null,
    };
  };

  const {
    data: shopifyAssets,
    isLoading: shopifyAssetsLoading,
    error: shopifyAssetsError,
    fetchNextPage: fetchNextShopifyAssets,
    hasNextPage: hasNextShopifyAssets,
    isFetchingNextPage: isFetchingNextShopifyAssets,
    refetch: refetchShopifyAssets,
  } = useInfiniteQuery({
    queryKey: ["storeAssets", session.user.shopifyStoreId, searchTermShopify],
    queryFn: fetchAssetsLists,
    getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor || null,
    enabled: session.user.shopifyStoreId ? true : false,
  });

  const {
    data: s3Assets,
    isLoading: s3AssetsLoading,
    error: s3AssetsError,
    fetchNextPage: fetchNextS3Assets,
    hasNextPage: hasNextS3Assets,
    isFetchingNextPage: isFetchingNextS3Assets,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["s3Assets", store.id, debouncedSearchTerm], // Include searchTerm in the key
    queryFn: fetchS3AssetsNew,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: store.id ? true : false,
  });

  // Handle search input change and refetch
  const handleSearchChange = (e) => {
    if (e.target.name === "s3-search") {
      setSearchTermS3(e.target.value);
    } else if (e.target.name === "shopify-search") {
      setSearchTermShopify(e.target.value);
    }
  };

  // Trigger refetch when debounced search term changes
  useEffect(() => {
    refetch();
  }, [debouncedSearchTerm, refetch]);

  useEffect(() => {
    refetchShopifyAssets();
  }, [refetchShopifyAssets]);

  const {
    handleMultipleImageUpload,
    isUploading,
    uploadedObjectKeys,
    resetUpload,
  } = useMultiImageUpload();

  useEffect(() => {
    if (uploadedObjectKeys.length > 0) {
      queryClient.invalidateQueries(["s3Assets", store.id]);
    }
  }, [uploadedObjectKeys, queryClient, store.id]);

  const importRef = useRef(null);
  const sheetTriggerRef = useRef(null);

  const [uploadedJson, setUploadedJson] = useState(null);

  useEffect(() => {
    if (gotoNext && selectedHtml) {
      router.push("/create-campaign?step=4");
    }
  }, [selectedHtml, gotoNext]);

  useEffect(() => {
    async function getTemp(id) {
      const res = await fetch(`/api/admin/templates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, genEmailData }),
      });

      const data = await res.json();
      window.TopolPlugin.load(JSON.stringify(data.json));
    }

    const template = searchParams.get("template");

    if (template) {
      getTemp(template);
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function getCampaign(id) {
      const res = await fetch(`api/klaviyo/get-campaigns?campaignId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setGenEmailDataFunc(data.genEmailData);
      window.TopolPlugin.load(JSON.stringify(data.jsonEmailTemplate));
    }

    const clone = searchParams.get("clone");

    if (clone) {
      getCampaign(clone);
    }
  }, [searchParams, router]);

  async function handleSave(json, html) {
    setExportedHtml(html);
    setExportedJson(json);
    setSelectedHtml(html);
    setSelectedJson(json);
  }

  async function nextContinue() {
    await window.TopolPlugin.save();
    setGotoNext(true);
  }

  useEffect(() => {
    async function exportHTML() {
      setExportClicked(false);
      const html = exportedHtml;
      const blob = new Blob([html], { type: "text/html" });
      const a = document.createElement("a");
      a.download = "email.html";
      a.href = URL.createObjectURL(blob);
      a.click();
    }

    if (exportClicked && exportedHtml) {
      exportHTML();
    }
  }, [exportedHtml]);

  useEffect(() => {
    async function exportJson() {
      setExportJsonClicked(false);
      const json = JSON.stringify(exportedJson, null, 2); // Convert object to JSON string
      const blob = new Blob([json], { type: "application/json" });
      const a = document.createElement("a");
      a.download = "email.json";
      a.href = URL.createObjectURL(blob);
      a.click();
    }

    if (exportJsonClicked && exportedJson) {
      exportJson();
    }
  }, [exportedJson]);

  function callExport() {
    setExportClicked(true);
    window.TopolPlugin.save();
  }

  function callExportJson() {
    setExportJsonClicked(true);
    window.TopolPlugin.save();
  }

  function importJson() {
    const file = importRef.current.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const json = JSON.parse(text);

      window.TopolPlugin.load(JSON.stringify(json));
    };
    reader.readAsText(file);
    setImportJsonClicked(true);
  }

  async function openFM() {
    setFmPopup(true);
  }

  return (
    <div>
      <Dialog open={fmPopup} onOpenChange={setFmPopup}>
        <DialogContent className="sm:max-w-[50%] w-[50%] min-h-[80%] flex flex-col justify-start">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-start justify-start">
              <div className="flex gap-3 items-start justify-start">
                <IoFileTrayStackedOutline /> File manager{" "}
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className=" overflow-y-auto scrollbar">
            <Tabs defaultValue="shopify" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shopify">Shopify Assets</TabsTrigger>
                <TabsTrigger value="custom">Uploaded Assets</TabsTrigger>
              </TabsList>
              <TabsContent value="shopify">
                <div className="flex items-center justify-between mt-3 mb-4">
                  <input
                    type="text"
                    name="shopify-search"
                    placeholder="Search"
                    className="border border-gray-200 rounded-lg p-2"
                    onChange={(e) => handleSearchChange(e)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 py-0 overflow-y-auto max-h-[550px] scrollbar mt-3 ">
                  {shopifyAssets?.pages?.length > 0
                    ? shopifyAssets.pages.map((page, index) => {
                        return page.products?.map((image, index) => {
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                TopolPlugin.chooseFile(
                                  image.node.preview.image.url
                                );
                                setFmPopup(false);
                              }}
                            >
                              <img
                                src={image.node.preview.image.url}
                                alt="Gallery Image 1"
                                width="100"
                                height="100"
                                className="object-cover w-full rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
                                style={{
                                  aspectRatio: "100/100",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          );
                        });
                      })
                    : "Shopify assets not found"}
                </div>
                <div className="flex items-center justify-end mt-5">
                  <RiLoader4Fill
                    fontSize={30}
                    className={`mr-5 spinner ${
                      shopifyAssetsLoading || isFetchingNextShopifyAssets
                        ? "block"
                        : "hidden"
                    }`}
                  />
                  <Button
                    onClick={() => fetchNextShopifyAssets()}
                    disabled={!hasNextShopifyAssets}
                    className="bg-black text-white flex items-center justify-center gap-2"
                  >
                    Load More
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="custom">
                <div className="flex items-center justify-between mt-3 mb-4">
                  <Button
                    className="bg-gray-300 hover:bg-gray-300 hover:text-gray-600 text-xs text-gray-600 flex items-center justify-center gap-2"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    disabled={isUploading}
                  >
                    Upload Images
                    <RiLoader4Fill
                      fontSize={20}
                      className={`spinner ${isUploading ? "block" : "hidden"}`}
                    />
                  </Button>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={(e) => {
                      handleMultipleImageUpload(e, store.id).then(() => {
                        e.target.files = null;
                      });
                    }}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="s3-search"
                    placeholder="Search"
                    className="border border-gray-200 rounded-lg p-2"
                    onChange={(e) => handleSearchChange(e)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 py-0 overflow-y-auto max-h-[550px] scrollbar">
                  {s3Assets?.pages?.length > 0
                    ? s3Assets?.pages?.map((page, index) => {
                        return page?.data?.map((image, index) => {
                          console.log(image);
                          return (
                            <div
                              key={image.id}
                              onClick={() => {
                                console.log(image.signedUrl);
                                TopolPlugin.chooseFile(image.signedUrl);
                                setFmPopup(false);
                              }}
                            >
                              <img
                                src={image.signedUrl}
                                alt="Gallery Image 1"
                                width="100"
                                height="100"
                                className="object-cover w-full rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
                                style={{
                                  aspectRatio: "100/100",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          );
                        });
                      })
                    : "Uploaded assets not found"}
                </div>
                <div className="flex items-center justify-end  mt-5">
                  <RiLoader4Fill
                    fontSize={30}
                    className={`mr-5 spinner ${
                      s3AssetsLoading || isFetchingNextS3Assets
                        ? "block"
                        : "hidden"
                    }`}
                  />
                  <Button
                    onClick={() => fetchNextS3Assets()}
                    disabled={!hasNextS3Assets}
                    className="bg-black text-white flex items-center justify-center gap-2"
                  >
                    Load More
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <div className="dashboard-header">
        <div className="dashboard-header-title">
          <img
            className="w-10 h-10 rounded-full "
            src="https://www.mybranz.com/logo.png"
          />
        </div>
        <div className="dashboard-header-feature">
          <Sheet>
            <SheetTrigger asChild>
              <Button ref={sheetTriggerRef} variant="outline">
                Export / Import
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Export/Import As</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <input
                    type="file"
                    accept="application/json"
                    style={{ display: "none" }}
                    id="json-upload"
                    name="json-upload"
                    ref={importRef}
                    onChange={() => importJson()}
                  />
                  <label
                    htmlFor="json-upload"
                    className="w-full"
                    onClick={() => importRef.current.click()}
                  >
                    <Button variant="outline" className="w-full">
                      Import JSON
                    </Button>
                  </label>
                </div>
                <Button variant="outline" onClick={() => callExportJson()}>
                  Export JSON
                </Button>
                <Button variant="outline" onClick={() => callExport()}>
                  Export HTML
                </Button>
              </div>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
          <Button
            className="bg-black text-white"
            onClick={() => nextContinue()}
          >
            <RiLoader4Fill
              fontSize={20}
              className={`spinner ${gotoNext ? "block" : "hidden"} mr-2`}
              disabled={gotoNext}
            />{" "}
            Finish Edit & Continue
          </Button>
        </div>
      </div>
      <TopolEditor
        options={TOPOL_OPTIONS}
        stage={"production"}
        onSave={handleSave}
        onOpenFileManager={openFM}
      ></TopolEditor>
    </div>
  );
}

function Dashboard({ session, store, user }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page session={session} store={store} user={user} />
    </Suspense>
  );
}

export default Dashboard;

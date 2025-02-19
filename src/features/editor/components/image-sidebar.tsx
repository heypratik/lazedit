import { useEffect, useState, useCallback } from "react";
import { ActiveTool, Editor, fonts } from "../types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGetImages } from "@/features/image/api/use-get-images";
import toast, { Toaster } from "react-hot-toast";
import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RiLoader4Fill } from "react-icons/ri";
import { fetchAssetsList } from "@/network/APIService";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { IoFileTrayStackedOutline } from "react-icons/io5";

export const useMultiImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedObjectKeys, setUploadedObjectKeys] = useState<any>([]);

  const uploadFile = async (file: any, storeId: any) => {
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

  const handleMultipleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, storeId: any) => {
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

// import { UploadButton } from "@/lib/uploadthing";

interface ImageSideBar {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  store: any
}
export const ImageSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
  store
}: ImageSideBar) => {

  console.log(store)

  const queryClient = useQueryClient();

  const [searchTermS3, setSearchTermS3] = useState("");
  const [searchTermShopify, setSearchTermShopify] = useState("");

  const useDebounce = (value: any, delay: any) => {
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

  const fetchAssetsLists = async ({ queryKey, pageParam }: {
    queryKey: [string, string, string];
    pageParam: any;
  }) => {
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

  const fetchS3AssetsNew = async ({ pageParam = 1, queryKey }: {
    pageParam: number | null;
    queryKey: [string, number, string];
  }) => {
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
      nextPage: pageParam && pageParam < data.pagination.totalPages ? pageParam + 1 : null,
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
    // queryKey: ["storeAssets", session.user.shopifyStoreId, searchTermShopify],
    queryKey: ["storeAssets", store.shopifyStoreId, searchTermShopify], 
     // @ts-ignore
    queryFn: fetchAssetsLists,
    getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor || null,
    // enabled: session.user.shopifyStoreId ? true : false,
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
    queryKey: ["s3Assets", store.id, debouncedSearchTerm],
    // @ts-ignore
    queryFn: fetchS3AssetsNew,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: store.id ? true : false,
  });

  // Handle search input change and refetch
  const handleSearchChange = (e: any) => {
    if (e.target.name === "s3-search") {
      setSearchTermS3(e.target.value);
    } else if (e.target.name === "shopify-search") {
      setSearchTermShopify(e.target.value);
    }
  };

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
      queryClient.invalidateQueries({ queryKey: ["s3Assets", store.id] });
    }
  }, [uploadedObjectKeys, queryClient, store.id]);

  const {data, isLoading, isError} = useGetImages();

  const onClose = () => {
    onChangeActiveTool("select");
  }; 

  const value = editor?.getActiveFontFamily();

  

  return (
<aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col overflow-y-scroll overflow-x-hidden",
        activeTool === "images" ? "block" : "hidden"
      )}
    >
      {/* <ToolSidebarHeader title="Images" description="Select or Add Images" /> */}

      {/* <div className="p-4 border-b">
        <UploadButton 
        appearance={{
          button: "w-full text font-medium bg-[#f33351] ring-0 outline-0 border-0 focus:ring-0 focus:outline-0 focus:border-0 hover:bg-[#f33351] hover:ring-0 hover:outline-0 hover:border-0",
          allowedContent: "hidden"
        }}
        content={{
          button: "Upload Image"
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(url) => editor?.addImage(url[0].url)}
        />
      </div> */}

      {/* {isLoading && (
        <div className="flex items-center justify-center flex-1 h-full">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}

{isError && (
        <div className="flex items-center justify-center flex-1 h-full gap-y-4 flex-col">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">Failed to Fetch Images</p>
        </div>
      )}

      <ScrollArea>
        <div className="p-4 ">
          <div className="grid grid-cols-2 gap-4">
        {data && data.map((image: any) => {
          return ( 
            <button onClick={() => editor?.addImage(image.urls.regular)} key={image.id} className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border">
              <Image fill src={image.urls.small} className="object-cover" alt={image?.alt?.description || "Image"} />
              <Link target="_blank" href={image.links.html} className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left">{image.user.name}</Link>
            </button>
          )
        })}
        </div>
        </div>
      </ScrollArea> */}

<Tabs defaultValue="shopify" className="w-full p-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shopify">Shopify Assets</TabsTrigger>
                <TabsTrigger value="custom">Uploaded Assets</TabsTrigger>
              </TabsList>
              <TabsContent value="shopify">
                <div className="flex items-center justify-between mt-3 mb-4 w-full flex-1">
                  <input
                    type="text"
                    name="shopify-search"
                    placeholder="Search"
                    className="border border-gray-200 rounded-lg p-2  w-full flex-1"
                    onChange={(e) => handleSearchChange(e)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 py-0 overflow-y-auto scrollbar mt-3 ">
                  {shopifyAssets?.pages?.length > 0
                    ? shopifyAssets.pages.map((page, index) => {
                        return page.products?.map((image: any, index: any) => {
                          return (
                            <div
                              key={index}
                              onClick={() => editor?.addImage(image.node.preview.image.url)}
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
                <div className="flex items-center justify-center mt-5">
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
                <div className="flex items-center justify-between mt-3 mb-4 flex-col gap-2">
                  <Button
                    className="bg-gray-300 hover:bg-gray-300 hover:text-gray-600 text-xs text-gray-600 flex items-center justify-center gap-2 w-full"
                    onClick={() => {
                      const fileUploadElement = document?.getElementById("file-upload");
                      if (fileUploadElement) {
                        fileUploadElement.click();
                      }
                    }}
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
                    className="border border-gray-200 rounded-lg p-2 w-full"
                    onChange={(e) => handleSearchChange(e)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 py-0 overflow-y-auto scrollbar">
                  {s3Assets?.pages?.length > 0
                    ? s3Assets?.pages?.map((page, index) => {
                        return page?.data?.map((image: any, index: any) => {
                          return (
                            <div
                              key={image.id}
                              onClick={() => editor?.addImage(image.signedUrl)}
                            >
                              <img
                                src={image.signedUrl}
                                alt="Gallery Image 1"
                                width="100"
                                onClick={() => {
                                  editor?.addImage(image.signedUrl)
                                }}
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
                <div className="flex items-center justify-center  mt-5">
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
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

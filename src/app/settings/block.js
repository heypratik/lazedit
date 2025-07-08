"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomLayout from "../layout/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tab";
import { Divider } from "../layout/divider";
import { Button } from "../layout/button";
import toast, { Toaster } from "react-hot-toast";
import { RiLoader4Fill } from "react-icons/ri";
import {
  fetchAssetsList,
  fetchProducts,
  fetchFromDBCu,
} from "@/network/APIService";
import { CiImageOn } from "react-icons/ci";
import { FaUndo } from "react-icons/fa";
import { getSignedUrlCf } from "../../lib/s3";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { getNames, getCode } from "country-list";

const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

const ColorPicker = ({ label, color, setColor }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-10 h-10 mr-2 !border-none cursor-pointer !rounded-none"
      />
      <div className="text-sm">{color}</div>
    </div>
  );
};

const ColorPalette = ({ colors, setColors }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="font-semibold mb-2 text-sm">Accent</h2>
        <ColorPicker
          label="Accent"
          color={colors?.accent}
          setColor={(value) =>
            setColors((prev) => ({ ...prev, accent: value }))
          }
        />
      </div>
      <div>
        <h2 className="font-semibold mb-2 text-sm">Body Text</h2>
        <ColorPicker
          label="Body Text"
          color={colors?.bodyText}
          setColor={(value) =>
            setColors((prev) => ({ ...prev, bodyText: value }))
          }
        />
      </div>
      <div>
        <h2 className="font-semibold mb-2 text-sm">Buttons</h2>
        <ColorPicker
          label="Buttons"
          color={colors?.button}
          setColor={(value) =>
            setColors((prev) => ({ ...prev, button: value }))
          }
        />
      </div>
      <div>
        <h2 className="font-semibold mb-2 text-sm">Links</h2>
        <ColorPicker
          label="Links"
          color={colors?.link}
          setColor={(value) => setColors((prev) => ({ ...prev, link: value }))}
        />
      </div>
    </div>
  );
};

const CustomImage = ({ objectKey, store, width, height, imageLoading }) => {
  const [imageData, setImageData] = useState(null);
  imageLoading(false);
  useEffect(() => {
    async function fetchImage() {
      const signedUrl = await getSignedUrlCf(objectKey, store.id, "10years");
      setImageData(signedUrl);
      return signedUrl;
    }

    fetchImage();
  }, [objectKey]);

  return imageData ? (
    <img
      src={imageData}
      alt={`custom-${imageData}`}
      className={`w-[${width}] h-[${height}] border-2 object-cover border-gray-200 rounded-md prod-images`}
    />
  ) : (
    <div
      className={`bg-gray-50 rounded-md w-[${width}] h-[${height}] border shadow-sm border-[#DDDDDD] flex items-center justify-center`}
    >
      <CiImageOn color="#818181" fontSize="20px" />
    </div>
  );
};

function Test({ session, store }) {
  // States
  const [userId, setUserId] = useState(null);
  const [logoObjectKey, setLogoObjectKey] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [klaviyoKey, setKlaviyoKey] = useState("");
  const [location, setLocation] = useState("");
  const [shipping, setShipping] = useState("");
  const [colors, setColors] = useState({
    accent: "#FF0000",
    bodyText: "#000000",
    button: "#000000",
    link: "#0000FF",
  });
  const [socials, setSocials] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: "",
  });
  const [menuLinks, setMenuLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shopifyStoreId, setShopifyStoreId] = useState(
    session?.user?.shopifyStoreId ? session?.user?.shopifyStoreId : null
  );
  const [endCursor, setEndCursor] = useState(null);
  const [startCursor, setStartCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [endCursorProduct, setEndCursorProduct] = useState(null);
  const [startCursorProduct, setStartCursorProduct] = useState(null);
  const [hasProductNextPage, setHasProductNextPage] = useState(false);
  const [hasProductPreviousPage, setHasProductPreviousPage] = useState(false);
  const [shopifyImages, setShopifyImages] = useState([]);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [cache, setCache] = useState({});

  useEffect(() => {
    if (menuLinks.length < 1) {
      setMenuLinks([{ id: 1, name: "", link: "" }]);
    }
  }, [menuLinks]);

  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    const [field, id] = name.split("-");
    const updatedMenuLinks = menuLinks.map((menu) => {
      if (menu.id === parseInt(id)) {
        return { ...menu, [field]: value };
      }
      return menu;
    });
    setMenuLinks(updatedMenuLinks);
  };

  const addNewMenu = () => {
    const newId =
      menuLinks.length > 0 ? Math.max(...menuLinks.map((m) => m.id)) + 1 : 1;
    setMenuLinks([...menuLinks, { id: newId, name: "", link: "" }]);
  };

  const removeMenu = (id) => {
    const updatedMenuLinks = menuLinks.filter((menu) => menu.id !== id);
    setMenuLinks(updatedMenuLinks);
  };

  const handleCacheUpdate = (key, value) => {
    setCache((prevCache) => ({ ...prevCache, [key]: value }));
  };

  const handleImageLoading = () => {
    setImageUploading(false);
  };

  const uploadFile = async (file) => {
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
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const handleImageChange = useCallback(
    async (e, variableToUpdate) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        let uploadedKeys = null;
        for (const file of files) {
          try {
            const response = await uploadFile(file);
            if (response.success && response.data.objectKey) {
              uploadedKeys = response.data.objectKey;
            } else {
              console.error("Failed to upload image:", file.name);
              notification(false, `Upload Failed: ${file?.name}`);
            }
          } catch (error) {
            console.error("Error uploading the image:", file.name, error);
            notification(false, `Upload Failed: ${file?.name}`);
          }
        }
        variableToUpdate(uploadedKeys);
      }
    },
    [token]
  );

  // Handle Input Change for All Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "storeName") {
      setStoreName(value);
    } else if (name === "domain") {
      setDomain(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "klaviyoKey") {
      setKlaviyoKey(value);
    } else if (name === "location") {
      setLocation(value);
    } else if (name.startsWith("colors.")) {
      const colorType = name.split(".")[1];
      setColors((prev) => ({ ...prev, [colorType]: value }));
    } else if (name.startsWith("socials.")) {
      const socialNetwork = name.split(".")[1];
      setSocials((prev) => ({ ...prev, [socialNetwork]: value }));
    } else if (name === "shipping") {
      setShipping(value);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      notification(false, "User not found");
      return;
    }

    // Check if all fields are filled & valid & not empty strings
    const missingFields = [];
    if (!storeName) missingFields.push("Store Name");
    if (!domain) missingFields.push("Domain");
    if (!email) missingFields.push("Email");
    if (!klaviyoKey) missingFields.push("Klaviyo Key");
    if (!location) missingFields.push("Location");
    if (!colors) missingFields.push("Colors");
    // if (!logoObjectKey) missingFields.push("Logo");

    if (missingFields.length > 0) {
      notification(false, `Missing fields: ${missingFields.join(", ")}`);
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
          mediaObjectKey: logoObjectKey,
          location: location,
          socials: socials,
          colors: colors,
          userId: userId,
          shipping: shipping,
          menuLinks: menuLinks,
          settingsCompleted: true,
          updateSettings: session?.user?.settingsCompleted ? false : true,
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
    if (store) {
      setLogoObjectKey(store.mediaObjectKey);
      setStoreName(store.name);
      setDomain(store.domain);
      setEmail(store.email);
      setKlaviyoKey(store.klaviyoKey);
      setLocation(store.location);
      if (store.socials) {
        setSocials(store.socials);
      }
      setColors(store.colors);
      setShipping(store.shipping);

      if (store.menuLinks) {
        setMenuLinks(store.menuLinks);
      }
    }
  }, [store]);

  useEffect(() => {
    if (
      shopifyStoreId &&
      shopifyStoreId !== null &&
      shopifyStoreId !== "" &&
      shopifyStoreId !== undefined
    ) {
      fetchStoreAssets();
      fetchStoreProducts();
    } else {
      fetchProductsfromDB();
    }
  }, []);

  async function fetchStoreAssets(cursor = null, direction = "next") {
    const response = await fetchAssetsList(shopifyStoreId, cursor, direction);

    if (response.products) {
      const data = response.products;
      setShopifyImages(data);

      // Update page information
      setHasNextPage(response.pageInfo.hasNextPage);
      setHasPreviousPage(response.pageInfo.hasPreviousPage);

      // Set the cursors for pagination
      setEndCursor(response.pageInfo.endCursor);
      setStartCursor(response.pageInfo.startCursor);
    } else {
      console.error("Failed to fetch assets");
    }
  }

  async function fetchStoreProducts(cursor = null, direction = "next") {
    const response = await fetchProducts(shopifyStoreId, cursor, direction);

    if (response.products) {
      const data = response.products;
      setShopifyProducts(data);

      // Update page information
      setHasProductNextPage(response.pageInfo.hasNextPage);
      setHasProductPreviousPage(response.pageInfo.hasPreviousPage);

      // Set the cursors for pagination
      setEndCursorProduct(response.pageInfo.endCursor);
      setStartCursorProduct(response.pageInfo.startCursor);
    } else {
      console.error("Failed to fetch assets");
    }
  }

  async function fetchProductsfromDB(page = 1, limit = 10) {
    const response = await fetchFromDBCu(store.id, page, limit);

    if (response.products) {
      const data = response.products;
      setShopifyProducts(data);

      // Update page information
      setHasProductNextPage(
        response.pageInfo.currentPage < response.pageInfo.totalPages
      );
      setHasProductPreviousPage(response.pageInfo.currentPage > 1);
      setCurrentPage(response.pageInfo.currentPage);
    } else {
      console.error("Failed to fetch assets");
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchStoreAssets(endCursor, "next");
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      fetchStoreAssets(startCursor, "prev");
    }
  };

  const handleProductNextPage = () => {
    if (hasProductNextPage) {
      if (
        shopifyStoreId &&
        shopifyStoreId !== null &&
        shopifyStoreId !== "" &&
        shopifyStoreId !== undefined
      ) {
        fetchStoreProducts(endCursorProduct, "next");
      } else {
        fetchProductsfromDB(currentPage + 1, 10);
      }
    }
  };

  const handleProductPreviousPage = () => {
    if (hasProductPreviousPage) {
      if (
        shopifyStoreId &&
        shopifyStoreId !== null &&
        shopifyStoreId !== "" &&
        shopifyStoreId !== undefined
      ) {
        fetchStoreProducts(startCursorProduct, "prev");
      } else {
        fetchProductsfromDB(currentPage - 1, 10);
      }
    }
  };

  return (
    <CustomLayout>
      <Toaster />
      <h1 className="text-2xl font-bold">Settings</h1>
      <Divider />
      <Tabs defaultValue="store" className="w-full">
        <TabsList>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>
        <TabsContent value="store">
          <div className="flex flex-col max-w-4xl mx-auto">
            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="storeName"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Store Name</span>
                <span className="text-sm text-gray-700 font-normal">
                  This name will be displayed while sending the emails.
                </span>
              </label>
              <input
                type="text"
                className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                id="storeName"
                name="storeName"
                value={storeName}
                onChange={handleInputChange}
                placeholder="Apple Inc"
              />
            </div>
            <Divider />

            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="domain"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Domain</span>
                <span className="text-sm text-gray-700 font-normal">
                  Your store domain.
                </span>
              </label>
              <input
                type="text"
                className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                id="domain"
                name="domain"
                value={domain}
                onChange={handleInputChange}
                placeholder="www.example.com"
              />
            </div>
            <Divider />

            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="email"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Email</span>
                <span className="text-sm text-gray-700 font-normal">
                  This email will be used to send your campaigns.
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
            <Divider />

            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="klaviyoKey"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Klaviyo Key</span>
                <span className="text-sm text-gray-700 font-normal">
                  Your Klaviyo key.
                </span>
              </label>
              <input
                type="text"
                className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                id="klaviyoKey"
                name="klaviyoKey"
                value={klaviyoKey}
                onChange={handleInputChange}
                placeholder="pk_xxxxxxxxxxxxxxxx"
              />
            </div>
            <Divider />

            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="logoUpload"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Logo</span>
                <span className="text-sm text-gray-700 font-normal">
                  Your brand logo.
                </span>
              </label>
              {!logoObjectKey && !imageUploading && (
                <input
                  type="file"
                  className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                  id="logoUpload"
                  name="logo"
                  onChange={(e) => handleImageChange(e, setLogoObjectKey)}
                  accept="image/*"
                />
              )}
              <RiLoader4Fill
                className={`text-[#000] ${
                  imageUploading ? "animate-spin" : "hidden"
                } mr-2`}
              />
              {logoObjectKey && (
                <div className="flex items-center justify-center">
                  <CustomImage
                    objectKey={logoObjectKey}
                    store={store}
                    imageLoading={handleImageLoading}
                    width="100px"
                    height="100px"
                  />{" "}
                  <FaUndo
                    className="cursor-pointer ml-2 border p-1 border-gray-400 rounded-sm"
                    fontSize="25px"
                    onClick={() => setLogoObjectKey(null)}
                  />
                </div>
              )}
            </div>

            <Divider />
            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="location"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Location</span>
                <span className="text-sm text-gray-700 font-normal">
                  Your store location.
                </span>
              </label>
              <select
                className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                id="location"
                name="location"
                value={location}
                onChange={handleInputChange}
              >
                <option value="">Select a country</option>
                {getNames().map((name) => (
                  <option
                    key={getCode(name)}
                    value={getCode(name)}
                    selected={location == getCode(name)}
                  >
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <Divider />

            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="colors"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Colors</span>
                <span className="text-sm text-gray-700 font-normal">
                  Your store colors.
                </span>
              </label>
              <ColorPalette colors={colors} setColors={setColors} />
            </div>
            <Divider />

            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="socials"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Socials</span>
                <span className="text-sm text-gray-700 font-normal">
                  Your brand socials.
                </span>
              </label>
              <div className="flex flex-col gap-2">
                {Object.entries(socials || {}).map(([network, value]) => (
                  <input
                    key={network}
                    type="text"
                    className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                    id={`socials-${network}`}
                    name={`socials.${network}`}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={`${
                      network.charAt(0).toUpperCase() + network.slice(1)
                    } URL`}
                  />
                ))}
              </div>
            </div>
            <Divider />
            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="header"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Email Header</span>
                <span className="text-sm text-gray-700 font-normal">
                  You can use this while building emails.
                </span>
              </label>
              <div className="flex flex-col gap-2 items-center justify-center">
                {/* <div className="flex gap-2">
                  <AiOutlinePlusCircle
                    size="40px"
                    className=" cursor-pointer"
                  />
                  <input
                    type="text"
                    className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                    id={`menu-name`}
                    name={`menu-name`}
                    placeholder={`Menu Name`}
                  />
                  <input
                    type="text"
                    className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                    id={`menu-name`}
                    name={`menu-name`}
                    placeholder={`Menu Link`}
                  />
                </div> */}

                {menuLinks.map((menu, index) => (
                  <div key={index} className="flex gap-2">
                    <AiOutlinePlusCircle
                      size={40}
                      className="cursor-pointer"
                      onClick={addNewMenu}
                    />
                    <input
                      type="text"
                      className="rounded-sm w-full px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                      id={`name-${menu.id}`}
                      name={`name-${menu.id}`}
                      value={menu.name}
                      onChange={handleMenuChange}
                      placeholder="Menu Name"
                    />
                    <input
                      type="text"
                      className="rounded-sm w-full px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                      id={`link-${menu.id}`}
                      name={`link-${menu.id}`}
                      value={menu.link}
                      onChange={handleMenuChange}
                      placeholder="Menu Link"
                    />
                    <AiOutlineMinusCircle
                      size={40}
                      className="cursor-pointer"
                      onClick={() => removeMenu(menu.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Divider />
            <div className="mt-6 items-center justify-between gap-4 flex">
              <label
                htmlFor="Shipping Info"
                className="form-label font-bold flex flex-col"
              >
                <span className="text-base ">Shipping Info</span>
                <span className="text-sm text-gray-700 font-normal">
                  This info will show on email headers.
                </span>
              </label>
              <input
                type="text"
                className="rounded-sm w-100 px-2 py-2 border-black border text-sm bg-gray-100 min-w-8 max-w-96"
                id="shipping"
                name="shipping"
                value={shipping}
                onChange={handleInputChange}
                placeholder="Free shipping on orders over $50"
              />
            </div>
            <Divider />
            <div className="flex items-center justify-end gap-4">
              <Button outline className="text-black">
                Cancel
              </Button>
              <Button className="bg-black text-white" onClick={handleSubmit}>
                Save
                {isLoading && <RiLoader4Fill className="animate-spin ml-1" />}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="assets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4 md:py-6">
            {shopifyImages &&
              shopifyImages?.map((image, index) => {
                return (
                  <div key={index}>
                    <img
                      src={image.node.preview.image.url}
                      alt="Gallery Image 1"
                      width="100"
                      height="100"
                      className="object-cover w-full rounded-lg overflow-hidden border border-gray-200"
                      style={{ aspectRatio: "100/100", objectFit: "cover" }}
                    />
                  </div>
                );
              })}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              disabled={!hasPreviousPage}
              onClick={handlePreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              disabled={!hasNextPage}
              onClick={handleNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          {/* <div className='flex flex-row gap-4 max-w-4xl mx-auto'>
      <Skeleton className="w-[200px] h-[200px]" />
      <Skeleton className="w-[200px] h-[200px]" />
      <Skeleton className="w-[200px] h-[200px]" />
      <Skeleton className="w-[200px] h-[200px]" />
    </div> */}
        </TabsContent>
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4 md:py-6">
            {shopifyProducts &&
              shopifyProducts?.map((product, index) => {
                return (
                  <div
                    key={index}
                    className="border border-gray-200 p-4 bg-[#f6f6f6]"
                  >
                    <img
                      src={
                        product?.node?.featuredImage?.url
                          ? product?.node?.featuredImage?.url
                          : "https://g-wezvrmxxcg9.vusercontent.net/placeholder.svg"
                      }
                      alt="Gallery Image 1"
                      width="100"
                      height="100"
                      className="object-cover w-full rounded-lg overflow-hidden border border-gray-200"
                      style={{ aspectRatio: "100/100", objectFit: "cover" }}
                    />
                    <h2 className="text-lg font-semibold mt-4">
                      {product?.node?.title ? product?.node?.title : "No Title"}
                    </h2>
                    <p>
                      {product?.node?.description
                        ? product.node.description.length > 50
                          ? product.node.description.slice(0, 50) + "..."
                          : product.node.description
                        : "No description."}
                    </p>
                  </div>
                );
              })}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              onClick={handleProductPreviousPage}
              disabled={!hasProductPreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              onClick={handleProductNextPage}
              disabled={!hasProductNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </TabsContent>
        <TabsContent value="import">
          {shopifyStoreId ? (
            "Products cannot be imported for accounts using Shopify"
          ) : (
            <CSVImporter session={session} store={store} />
          )}
        </TabsContent>
      </Tabs>
    </CustomLayout>
  );
}

export default Test;

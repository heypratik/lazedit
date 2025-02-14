import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoImageOutline } from "react-icons/io5";
import { GlobalContext } from "@/context/GlobalContext";
import {
  fetchAssetsList,
  fetchProducts,
  fetchFromDBCu,
} from "@/network/APIService";
import { Skeleton } from "@/components/ui/skeleton";

const ProductModal = ({
  handleProductSelect,
  closeDialog,
  selectedProducts,
  shopifyStoreId,
  storeId,
  userType,
  immediateSelection = false, // New prop to control selection behavior
}) => {
  const { productMark, setProductMark } = useContext(GlobalContext);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [productData, setProductData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [startCursor, setStartCursor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const ids = selectedProducts?.map((item) => item.id);
      setSelectedProduct(ids);
    }
  }, [selectedProducts]);

  useEffect(() => {
    setProductMark(selectedProduct);
  }, [selectedProduct]);

  useEffect(() => {
    if (userType === "shopify") {
      getProducts(null, "next", searchTerm);
    } else {
      getProductsFromDB(currentPage, 12, searchTerm);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  async function getProducts(
    cursor = null,
    direction = "next",
    searchQuery = ""
  ) {
    const productRes = await fetchProducts(
      shopifyStoreId,
      cursor,
      direction,
      searchQuery
    );
    if (productRes.products) {
      const data = productRes.products;
      setProductData(data);
      setAllProducts([...allProducts, ...data]);
      setHasNextPage(productRes.pageInfo.hasNextPage);
      setHasPreviousPage(productRes.pageInfo.hasPreviousPage);
      setEndCursor(productRes.pageInfo.endCursor);
      setStartCursor(productRes.pageInfo.startCursor);
    }
  }

  async function getProductsFromDB(page = 1, limit = 12, search = "") {
    const productRes = await fetchFromDBCu(storeId, page, limit, search);
    if (productRes.products) {
      const data = productRes.products;
      setProductData(data);
      setAllProducts([...allProducts, ...data]);
      setHasNextPage(
        productRes.pageInfo.currentPage < productRes.pageInfo.totalPages
      );
      setHasPreviousPage(productRes.pageInfo.currentPage > 1);
      setCurrentPage(productRes.pageInfo.currentPage);
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      if (userType === "shopify") {
        getProducts(endCursor, "next", searchTerm);
      } else {
        getProductsFromDB(currentPage + 1, 12, searchTerm);
      }
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      if (userType === "shopify") {
        getProducts(startCursor, "previous", searchTerm);
      } else {
        getProductsFromDB(currentPage - 1, 12, searchTerm);
      }
    }
  };

  const ToggleMark = (id) => {
    setSelectedProduct((prevSelected) => {
      const newSelection = prevSelected.includes(id)
        ? prevSelected.filter((i) => i !== id)
        : [...prevSelected, id];

      // If immediateSelection is true, send the product immediately
      if (immediateSelection) {
        const product = allProducts.find((item) => item.node.id === id);
        if (product) {
          handleProductSelect([product.node]);
        }
      }

      return newSelection;
    });
  };

  const extractProductDatabyId = (id) => {
    const prod = allProducts.find((item) => item.node.id === id);
    return prod.node;
  };

  function nextStep() {
    const newArray = selectedProduct.map((id) => extractProductDatabyId(id));
    handleProductSelect(newArray);
    closeDialog();
  }

  const isProductSelected = (id) => {
    return selectedProduct.includes(id);
  };

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md pr-10"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <IoSearchOutline
          className="absolute right-3 top-3 text-gray-400"
          size={20}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {!productData || productData.length <= 0 ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[150px] rounded-md" />
            ))}
          </>
        ) : (
          productData.map((item, index) => (
            <div
              key={index}
              onClick={() => ToggleMark(item.node.id)}
              className={`relative p-2 rounded-md border border-gray-300 transition-all duration-300 cursor-pointer 
                ${
                  isProductSelected(item.node.id)
                    ? "bg-[#ffb9c481] border-2 border-[#ea304d]"
                    : "bg-white hover:shadow-lg"
                }`}
            >
              <div className="flex justify-center mb-2">
                {item?.node?.images?.edges[0]?.node?.url ? (
                  <img
                    className="w-20 h-20 object-contain"
                    src={item?.node?.images?.edges[0]?.node?.url}
                    alt={item.node.title}
                  />
                ) : (
                  <div className="flex justify-center items-center w-20 h-20">
                    <IoImageOutline size={20} />
                  </div>
                )}
              </div>
              <h2 className="text-sm font-semibold text-center truncate">
                {item.node.title}
              </h2>
              <h3 className="text-xs font-semibold text-center truncate">
                Inventory: {item.node.totalInventory}
              </h3>
              {isProductSelected(item.node.id) && (
                <div className="absolute top-1 right-1 bg-[#ea304d] text-white rounded-full p-0.5">
                  <FaCheck size={8} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <div />
        <div className="flex items-center gap-3">
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
        {!immediateSelection && (
          <button
            type="button"
            className="bg-[#ea304d] text-white px-6 py-2 rounded-md hover:bg-[#ea304d] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedProduct.length <= 0}
            onClick={() => nextStep()}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductModal;

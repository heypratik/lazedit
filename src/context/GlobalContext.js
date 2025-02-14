"use client";

import { createContext, useState } from "react";
import { fetchAssetsList, fetchProducts } from "../network/APIService";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState({
    productMark: [],
  });

  const [genEmailData, setGenEmailData] = useState({
    campaignName: "",
    campaignType: "",
    campaignDescription: "",
    senderName: "",
    senderEmail: "",
    subject: "",
    replyToEmail: "",
    introductory_text: "",
  });
  const [segments, setSegments] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [excludedSegments, setExcludedSegments] = useState([]);
  const [selectedHtml, setSelectedHtml] = useState("");
  const [selectedJson, setSelectedJson] = useState("");

  const [klaviyoList, setKlaviyoList] = useState([]);
  const [selectedKlaviyoList, setSelectedKlaviyoList] = useState([]);

  const setProductMark = (productMark) => {
    setState((prevState) => ({
      ...prevState,
      productMark,
    }));
  };

  const setGenEmailDataFunc = (genEmailData) => {
    setGenEmailData(genEmailData);
  };

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        setProductMark,
        setGenEmailDataFunc,
        genEmailData,
        setSegments,
        segments,
        selectedSegments,
        setSelectedSegments,
        klaviyoList,
        setKlaviyoList,
        selectedKlaviyoList,
        setSelectedKlaviyoList,
        excludedSegments,
        setExcludedSegments,
        setSelectedHtml,
        selectedHtml,
        setSelectedJson,
        selectedJson,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

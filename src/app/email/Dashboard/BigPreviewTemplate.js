import React, { useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BigPreviewTemplate = ({ htmlTemplate }) => {
  const iframeRef = useRef(null);

  const containerStyles = {
    width: "100%", // Common mobile screen width
    height: "800px", // Common mobile screen height (iPhone 8)
    margin: "0 auto",
    border: "2px solid #f6f6f6",
    borderRadius: "5px",
    overflow: "hidden",
    position: "relative",
  };

  const iframeStyles = {
    width: "100%",
    height: "100%",
    border: "none",
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlTemplate);
      iframeDoc.close();
    }
  }, [htmlTemplate]);

  return (
    <>
      {htmlTemplate !== "undefined" && htmlTemplate != null ? (
        <div style={containerStyles} className="p-6 bg-gray-50 min-h-[100vh]">
          <iframe ref={iframeRef} style={iframeStyles} title="Email Preview" />
        </div>
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
    </>
  );
};

export default BigPreviewTemplate;

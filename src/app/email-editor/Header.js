import React, { useState, useContext, useRef, useEffect } from "react";
import Link from "next/link";
import { GlobalContext } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";
import generatePreviewHtml from "@/components/EmailEditor/utils/generatePreviewHtml";
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

const Header = (props) => {
  const router = useRouter();
  const importRef = useRef(null);
  const sheetTriggerRef = useRef(null);

  const { emailEditorEl, setLanguage, onJsonUpload } = props;
  const [uploadedJson, setUploadedJson] = useState(null);
  const { setSelectedHtml, setSelectedJson } = useContext(GlobalContext);

  const finishEdit = () => {
    const jsonData = emailEditorEl.current.blockList;
    const jsonString = JSON.stringify(jsonData, null, 2);
    const html = generatePreviewHtml(jsonData);
    setSelectedHtml(html);
    setSelectedJson(jsonData);
    conole.log(jsonData, "SETJSONDATA");
    router.push("/create-campaign?step=4");
  };

  const exportHTML = () => {
    const jsonData = emailEditorEl.current.blockList;
    const html = generatePreviewHtml(jsonData);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.download = "email.html";
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  const exportJSON = () => {
    const jsonData = emailEditorEl.current.blockList;
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const a = document.createElement("a");
    a.download = "data.json";
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          onJsonUpload(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const changeLanguage = (language) => () => {
    setLanguage(language);
  };

  const handleClick = () => {
    console.log("ref triggerdd");
    importRef.current.click();
  };

  // Add useEffect to listen for Control + E
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "e") {
        event.preventDefault(); // Prevent any default browser behavior
        sheetTriggerRef.current?.click(); // Trigger the sheet
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-title">Email Editor</div>
      <div className="dashboard-header-feature">
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button ref={sheetTriggerRef} variant="outline">Export / Import</Button>
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
                  style={{ display: 'none' }}
                  id="json-upload"
                  name="json-upload"
                  onChange={handleJsonUpload}
                  ref={importRef}
                />
                <label htmlFor="json-upload" className="w-full">
                  <Button variant="outline" onClick={handleClick} className="w-full">Import JSON</Button>
                </label>
              </div>
              <Button variant="outline" onClick={exportJSON}>
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => exportHTML()}>
                Export HTML
              </Button>
            </div>
            <SheetFooter></SheetFooter>
          </SheetContent>
        </Sheet> */}
        <Button className="bg-black text-white" onClick={() => finishEdit()}>
          Finish Edit & Continue
        </Button>
      </div>
    </div>
  );
};

export default Header;

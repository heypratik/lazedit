// "use client";

// import EmailEditor from "../../components/EmailEditor";
// import { useRef, useState, useEffect, useContext, Suspense } from "react";
// import { emailTemplates } from "./Dashboard/defaultBlockList";
// import Header from "./Dashboard/Header";
// import { useSearchParams, useRouter } from "next/navigation";
// import { GlobalContext } from "@/context/GlobalContext";
// import EmailTemplateReplacer from "@/lib/emailTemplateReplacer";

// function DashboardContent() {
//   const emailEditorRef = useRef(null);
//   const { genEmailData, setGenEmailDataFunc } = useContext(GlobalContext);
//   const [emailData, setEmailData] = useState(null);
//   const [language, setLanguage] = useState("en");
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     const template = searchParams.get("template");

//     if (template) {
//       findTemplate(template);
//     }
//   }, [searchParams, router]);

//   function findTemplate(template) {
//     const arrayOfObjects = emailTemplates;
//     const foundObject = arrayOfObjects.find((item) => item.id == template);
//     if (!foundObject) return null;
//     const duplicatedEmail = foundObject.template;
//     const updatedEmailData = EmailTemplateReplacer( duplicatedEmail, genEmailData );
//     setEmailData(updatedEmailData);
//   }

//   const handleJsonUpload = (json) => {
//     setEmailData(json);
//   };

//   return (
//     <>
//       <Header
//         emailEditorEl={emailEditorRef}
//         setLanguage={setLanguage}
//         jsonEl={emailData}
//         onJsonUpload={handleJsonUpload}
//       />
//       <div className="dashboard-content">
//         <EmailEditor ref={emailEditorRef} defaultBlockList={emailData} />
//       </div>
//     </>
//   );
// }

// function Dashboard() {
//   return (
//     <div className="dashboard">
//       <Suspense fallback={<div>Loading...</div>}>
//         <DashboardContent />
//       </Suspense>
//     </div>
//   );
// }

// export default Dashboard;

import React from "react";

function page() {
  return <div>page</div>;
}

export default page;

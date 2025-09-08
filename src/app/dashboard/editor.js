"use client";

import CustomLayout from "../layout/layout";
import toast, { Toaster } from "react-hot-toast";
import { Banner } from "./components/banner";
import ProjectsTable from "./components/table";
import Templates from "./components/templates";

export default function Editor({ organization, userId }) {
  return (
    <CustomLayout>
      <Toaster />
      <Banner organization={organization} userId={userId} />
      <ProjectsTable organization={organization} userId={userId} />
    </CustomLayout>
  );
}

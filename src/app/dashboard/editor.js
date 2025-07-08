"use client";

import CustomLayout from "../layout/layout";
import toast, { Toaster } from "react-hot-toast";
import { Banner } from "./components/banner";
import ProjectsTable from "./components/table";
import Templates from "./components/templates";

export default function Editor({ store }) {
  return (
    <CustomLayout>
      <Toaster />
      <Banner store={store} />
      <Templates store={store} />
      <ProjectsTable store={store} />
    </CustomLayout>
  );
}

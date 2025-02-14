import Dashboard from "../../components/Dashboard";
import FathersDay from "../fathersday/page";
import PreviewContent from "../previewcontent/page";
import Settings from "../settings/page";
import PostBuilding from "../PostBuilding/page";
import EmailBuildingWrapper from "../email-building/page";
import { Suspense } from 'react'

export default function Home() {
  return (
    <div>
      {/* <Dashboard /> */}
      {/* <PostBuilding /> */}
      <EmailBuildingWrapper />
      {/* <FathersDay /> */}
      {/* <PreviewContent /> */}
      {/* <Settings /> */}
    </div>
  );
}

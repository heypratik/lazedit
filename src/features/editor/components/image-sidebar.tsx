import { ActiveTool, Editor, fonts } from "../types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGetImages } from "@/features/image/api/use-get-images";
import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { UploadButton } from "@/lib/uploadthing";

interface ImageSideBar {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const ImageSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSideBar) => {

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
      <ToolSidebarHeader title="Images" description="Select or Add Images" />

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

      {isLoading && (
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
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

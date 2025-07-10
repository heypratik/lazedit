"use client";
import Logo from "@/features/editor/components/logo";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Loader, MousePointerClick, Redo2, Undo2 } from "lucide-react";
import { CiFileOn } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { ActiveTool, Editor } from "@/features/editor/types";
import {cn} from "@/lib/utils";
import {useFilePicker} from "use-file-picker";
import { useMutationState } from "@tanstack/react-query";
import { Minimize, ZoomIn, ZoomOut } from "lucide-react";

interface NavbarProps {
    id: string;
    name: string;
  editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Navbar = ({
  id,
  name,
  editor,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {

  const data = useMutationState({
    filters: {
      mutationKey: ["project", { id }],
    },

    select: (mutation) => mutation.state.status
  })

  const currentState = data[data.length - 1]; 
  const isError = currentState === "error";
  const isPending = currentState === "pending";

  const {openFilePicker} = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) => {
        editor?.loadJson(e.target?.result as string); 
      }
      }
    },
  })
  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px] glass-strong overflow-hidden">
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="text-white flex items-center space-x-2 h-8 px-3 glass-subtle cursor-pointer hover:bg-white/10 transition-all duration-200">
              File
              <ChevronDown className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-60 glass-subtle cursor-pointer hover:bg-white/10 transition-all duration-200" align="start">
            <DropdownMenuItem  className="flex items-center gap-x-2 text-white" onClick={() => openFilePicker()}>
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">Open</p>
                <p className="text-xs text-muted-foreground !m-0">Open JSON</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className=" mx-2" />
        <Hint label="Select" side="left" sideOffset={10}>
        <Button size="icon" variant="ghost" onClick={() => onChangeActiveTool("select")}
          className={cn(" text-white hover:glass-subtle hover:text-black", activeTool === "select" && "hover:glass-subtle glass-subtle text-white")}>
          <MousePointerClick className="size-4 hover:text-black" />
        </Button>
        </Hint>
        <Hint label="Undo" side="left" sideOffset={10}>
        <Button disabled={!editor?.canUndo()} onClick={() => editor?.onUndo()} size="icon" variant="ghost" className={cn(" text-white hover:text-black", activeTool === "select" && "hover:glass-subtle glass-subtle text-white")}>
          <Undo2 className="size-4 hover:text-black" />
        </Button>
        </Hint>
        <Hint label="Redo" side="left" sideOffset={10}>
        <Button  disabled={!editor?.canRedo()} onClick={() => editor?.onRedo()}  size="icon" variant="ghost" className={cn(" text-white hover:text-black", activeTool === "select" && "hover:glass-subtle glass-subtle text-white")}>
          <Redo2 className="size-4 hover:text-black" />
        </Button>
        </Hint>
        <Separator orientation="vertical" className=" mx-2" />
        {!isPending && !isError && <div className=" flex items-center gap-x-2 justify-center">
          <BsCloudCheck className="size-[20px] text-white/80" />
          <p className="text-xs !m-0 font-medium text-white/80">Saved</p>
        </div>}


        {!isPending && isError && <div className=" flex items-center gap-x-2 justify-center">
          <BsCloudSlash className="size-[20px] text-white/80" />
          <p className="text-xs !m-0 font-medium text-white/80">Failed to save</p>
        </div>}

        {isPending && <div className=" flex items-center gap-x-2 justify-center">
          <Loader className="size-4 animate-spin text-white/80" />
          <p className="text-xs !m-0 font-medium text-white/80">Saving...</p>
        </div>}
        <div className="ml-auto flex items-center gap-x-4">
          {/* <Input className="w-40 border border-gray-200 rounded p-2" placeholder="Untitled" value={name} onChange={(e) => onChangeActiveTool(e.target.value)} /> */}

          <Hint label="Reset Zoom" side="left" sideOffset={10}>
                  <Button
                    onClick={() => editor?.autoZoom()}
                    size="icon"
                    variant="ghost"
                    className="hover:glass-subtle glass-subtle text-white"
                  >
                    <Minimize className="size-4" />
                  </Button>
                </Hint>
                <Hint label="Zoom in" side="left" sideOffset={10}>
                  <Button
                    onClick={() => editor?.zoomIn()}
                    size="icon"
                    variant="ghost"
                    className="hover:glass-subtle glass-subtle text-white"
                  >
                    <ZoomIn className="size-4" />
                  </Button>
                </Hint>
                <Hint label="Zoom out" side="left" sideOffset={10}>
                  <Button
                    onClick={() => editor?.zoomOut()}
                    size="icon"
                    variant="ghost"
                    className="hover:glass-subtle glass-subtle text-white"
                  >
                    <ZoomOut className="size-4" />
                  </Button>
                </Hint>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="text-white flex items-center space-x-2 h-8 px-3 glass-subtle cursor-pointer hover:bg-white/10 transition-all duration-200">
              Export
              <Download className="size-4 ml-2 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-60 glass-subtle cursor-pointer hover:bg-white/10 transition-all duration-200" align="end">
            <DropdownMenuItem  className="flex items-center gap-x-2 text-white" onClick={() => editor?.saveJson()}> 
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">JSON</p>
                <p className="!m-0 text-xs text-muted-foreground">Save for later editing</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2 text-white" onClick={() => editor?.savePng()}>
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">PNG</p>
                <p className="!m-0 text-xs text-muted-foreground">Best for web</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2 text-white" onClick={() => editor?.saveJpg()}>
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">JPG</p>
                <p className="!m-0 text-xs text-muted-foreground">Best for printing</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2 text-white" onClick={() => editor?.saveSvg()}>
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">SVG</p>
                <p className="!m-0 text-xs text-muted-foreground">Best for vector editing</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
         </div>
      </div>
    </nav>
  );
};

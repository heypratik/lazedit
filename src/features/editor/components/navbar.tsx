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
import { Input } from "@headlessui/react";

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
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDown className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-60" align="start">
            <DropdownMenuItem  className="flex items-center gap-x-2" onClick={() => openFilePicker()}>
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">Open</p>
                <p className="text-xs text-muted-foreground !m-0">Open JSON</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className=" mx-2" />
        <Hint label="Select" side="bottom"sideOffset={10}>
        <Button size="icon" variant="ghost" onClick={() => onChangeActiveTool("select")}
          className={cn(
            activeTool === "select" && "bg-gray-100"
          )}>
          <MousePointerClick className="size-4" />
        </Button>
        </Hint>
        <Hint label="Undo" side="bottom"sideOffset={10}>
        <Button disabled={!editor?.canUndo()} onClick={() => editor?.onUndo()} size="icon" variant="ghost">
          <Undo2 className="size-4" />
        </Button>
        </Hint>
        <Hint label="Redo" side="bottom"sideOffset={10}>
        <Button  disabled={!editor?.canRedo()} onClick={() => editor?.onRedo()}  size="icon" variant="ghost">
          <Redo2 className="size-4" />
        </Button>
        </Hint>
        <Separator orientation="vertical" className=" mx-2" />
        {!isPending && !isError && <div className=" flex items-center gap-x-2 justify-center">
          <BsCloudCheck className="size-[20px] text-muted-foreground" />
          <p className="text-muted-foreground text-xs !m-0">Saved</p>
        </div>}


        {!isPending && isError && <div className=" flex items-center gap-x-2 justify-center">
          <BsCloudSlash className="size-[20px] text-muted-foreground" />
          <p className="text-muted-foreground text-xs !m-0">Failed to save</p>
        </div>}

        {isPending && <div className=" flex items-center gap-x-2 justify-center">
          <Loader className="size-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-xs !m-0">Saving...</p>
        </div>}
        <div className="ml-auto flex items-center gap-x-4">
          {/* <Input className="w-40 border border-gray-200 rounded p-2" placeholder="Untitled" value={name} onChange={(e) => onChangeActiveTool(e.target.value)} /> */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              Export
              <Download className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-60" align="end">
            <DropdownMenuItem  className="flex items-center gap-x-2" onClick={() => editor?.saveJson()}> 
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">JSON</p>
                <p className="!m-0 text-xs text-muted-foreground">Save for later editing</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2" onClick={() => editor?.savePng()}>
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">PNG</p>
                <p className="!m-0 text-xs text-muted-foreground">Best for web</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2" onClick={() => editor?.saveJpg()}>
              <CiFileOn className="size-8" />
              <div className="!m-0">
                <p className="!m-0">JPG</p>
                <p className="!m-0 text-xs text-muted-foreground">Best for printing</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2" onClick={() => editor?.saveSvg()}>
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

"use client";
import Logo from "@/features/editor/components/logo";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, MousePointerClick, Redo2, Undo2 } from "lucide-react";
import { CiFileOn } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";
import { BsCloudCheck } from "react-icons/bs";
import { ActiveTool, Editor } from "@/features/editor/types";
import {cn} from "@/lib/utils";

interface NavbarProps {
  editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Navbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
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
            <DropdownMenuItem  className="flex items-center gap-x-2">
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
        <div className=" flex items-center gap-x-2">
          <BsCloudCheck className="size-[20px] text-muted-foreground" />
          <p className="text-muted-foreground text-xs">Saved</p>
        </div>
        <div className="ml-auto flex items-center gap-x-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              Export
              <Download className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-60" align="end">
            <DropdownMenuItem  className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>JSON</p>
                <p className="text-xs text-muted-foreground">Save for later editing</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>PNG</p>
                <p className="text-xs text-muted-foreground">Best for web</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>JPG</p>
                <p className="text-xs text-muted-foreground">Best for printing</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem  className="flex items-center gap-x-2">
              <CiFileOn className="size-8" />
              <div>
                <p>SVG</p>
                <p className="text-xs text-muted-foreground">Best for vector editing</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
         </div>
      </div>
    </nav>
  );
};

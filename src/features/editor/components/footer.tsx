import { Minimize, ZoomIn, ZoomOut } from "lucide-react";

import { Editor } from "@/features/editor/types";
import CommandBar from "@/features/editor/components/CommandBar";

interface FooterProps {
  editor: Editor | undefined;
}

export const Footer = ({ editor }: FooterProps) => {
  return (
    <footer className="h-[150px] overflow-hidden bg-black w-full flex items-center overflow-x-auto z-[49] flex-row-reverse relative">
      <CommandBar editor={editor} />
    </footer>
  );
};
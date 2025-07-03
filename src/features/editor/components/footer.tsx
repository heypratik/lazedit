import { Minimize, ZoomIn, ZoomOut } from "lucide-react";

import { Editor } from "@/features/editor/types";
import CommandBar from "@/features/editor/components/CommandBar";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface FooterProps {
  editor: Editor | undefined;
};

export const Footer = ({ editor }: FooterProps) => {
  return (
    <footer className="h-[150px] overflow-hidden bg-black w-full flex items-center overflow-x-auto z-[49] flex-row-reverse">
      <CommandBar editor={editor} />
      {/* <Hint label="Reset" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.autoZoom()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <Minimize className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom in" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.zoomIn()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomIn className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom out" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.zoomOut()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomOut className="size-4" />
        </Button>
      </Hint> */}
    </footer>
  );
};

import { ActiveTool, Editor, fonts } from "../types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FontSidebar {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const FontSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSidebar) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const value = editor?.getActiveFontFamily();

  

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col overflow-y-scroll overflow-x-hidden",
        activeTool === "font" ? "block" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Font" description="Change the text font" />
      <ScrollArea>
        <div className="p-4 space-y-2 border-b">
        {fonts.map((font) => (
          <Button
            key={font}
            variant="secondary"
            size="lg"
            className={cn("w-full h-16 justify-start text-left py-2 px-4 hover:bg-gray-300",
              value === font && 'bg-[#f23250] text-white'
            )} 
            style={{ fontFamily: font, fontSize: "16px"  }}
            onClick={() => editor?.changeFontFamily(font)}
          >
            {font}
          </Button>
        ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

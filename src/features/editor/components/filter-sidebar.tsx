import { ActiveTool, Editor, filters, fonts } from "../types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FilterSidebar {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebar) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const value = editor?.getActiveImageFilters() || []

  

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col overflow-y-scroll overflow-x-hidden",
        activeTool === "filter" ? "block" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Filters" description="Apply a filter to selected image" />
      <ScrollArea>
        <div className="p-4 space-y-2 border-b">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant="secondary"
            size="lg"
            className={cn("w-full h-16 justify-start text-left py-2 px-4 hover:bg-gray-300",
              value[0] === filter && 'bg-[#f23250] text-white'
            )} 
            onClick={() => editor?.changeImageFilter(filter)}
          >
            {filter.toUpperCase()}
          </Button>
        ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

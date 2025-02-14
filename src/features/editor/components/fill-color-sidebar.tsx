import { ActiveTool, Editor, FILL_COLOR } from '../types';
import {cn} from "@/lib/utils";
import { ToolSidebarHeader } from './tool-sidebar-header';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './color-picker';


interface FillColorSidebar {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}
export const FillColorSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: FillColorSidebar) => {

    const value = editor?.getActiveFillColor() || FILL_COLOR;
 
    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChange = (value: string) => {
        editor?.changeFillColor(value);
    }
    return (
        <aside className={cn("bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
            activeTool === "fill" ? "block" : "hidden"
         )}>
            <ToolSidebarHeader title="Fill Color" description='Add fill color to your element'/>
            <ScrollArea>
                <div className='p-4 space-y-6'>
                    <ColorPicker value={value} onChange={onChange} />
                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    )
};
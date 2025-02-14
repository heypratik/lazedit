import { ActiveTool, Editor, FILL_COLOR, STROKE_COLOR } from '../types';
import {cn} from "@/lib/utils";
import { ToolSidebarHeader } from './tool-sidebar-header';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './color-picker';


interface StrokeColorSidebar {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}
export const StrokeColorSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: StrokeColorSidebar) => {

    const value = editor?.getActiveStrokeColor() || STROKE_COLOR;
 
    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChange = (value: string) => {
        editor?.changeStrokeColor(value);
    }
    return (
        <aside className={cn("bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
            activeTool === "stroke-color" ? "block" : "hidden"
         )}>
            <ToolSidebarHeader title="Stroke Color" description='Add stroke color to your element'/>
            <ScrollArea>
                <div className='p-4 space-y-6 w-full'>
                    <ColorPicker value={value} onChange={onChange} />
                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    )
};
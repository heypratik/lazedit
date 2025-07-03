import { ActiveTool, Editor } from '../types';
import {cn} from "@/lib/utils";
import { ToolSidebarHeader } from './tool-sidebar-header';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShapeTool } from './shape-tool';
import { FaCircle, FaSquare, FaSquareFull } from 'react-icons/fa';
import { IoTriangle } from 'react-icons/io5';
import { FaDiamond } from 'react-icons/fa6';

interface ShapeSidebar {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}
export const ShapeSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: ShapeSidebar) => {

    const onClose = () => {
        onChangeActiveTool("select");
    }
    return (
        <aside className={cn("bg-black glass relative border-r z-[40] w-[360px] h-full flex flex-col",
            activeTool === "shapes" ? "block" : "hidden"
         )}>
            <ToolSidebarHeader title="Shapes" description='Add shapes to your canvas'/>
            <ScrollArea>
                <div className='grid grid-cols-3 gap-4 p-4'>
                    <ShapeTool 
                    onclick={() => editor?.addCircle()}
                    icon={FaCircle}
                    />
                    <ShapeTool 
                    onclick={() => editor?.addSoftRectangle()}
                    icon={FaSquare}
                    />
                    <ShapeTool 
                    onclick={() => editor?.addSquare()}
                    icon={FaSquareFull}
                    />
                    <ShapeTool 
                    onclick={() => editor?.addTriangle()}
                    icon={IoTriangle}
                    />
                    <ShapeTool 
                    onclick={() => editor?.addTriangleInverse()}
                    icon={IoTriangle}
                    iconClassName=' rotate-180'
                    />
                    <ShapeTool 
                    onclick={() => editor?.addDiamond()}
                    icon={FaDiamond}
                    />
                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    )
};
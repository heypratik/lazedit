import { ActiveTool, Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from '../types';
import {cn} from "@/lib/utils";
import { ToolSidebarHeader } from './tool-sidebar-header';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './color-picker';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface StrokeWidthSidebar {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}
export const StrokeWidthSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: StrokeWidthSidebar) => {

    const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
    const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;
 
    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChangeStrokeWidth = (value: number) => {
        editor?.changeStrokeWidth(value);
    }

    const onChangeStrokeType = (value: number[]) => {
        editor?.changeStrokeDashArray(value);
    }
    return (
        <aside className={cn("bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
            activeTool === "stroke-width" ? "block" : "hidden"
         )}>
            <ToolSidebarHeader title="Border Width" description='Modify the border width of the object'/>
            <ScrollArea>
                <div className='p-4 space-y-4 border-b'>
                    <Label className='text-sm'>
                        Border Width
                    </Label>
                    <Slider value={[widthValue]} onValueChange={
                        (values) => onChangeStrokeWidth(values[0])
                    }  /> 
                </div>

                <div className='p-4 space-y-4 border-b'>
                    <Label className='text-sm'>
                        Border Width
                    </Label>
                    <Button 
                    onClick={() => onChangeStrokeType([])} 
                    variant="secondary" size="lg" 
                    className={cn('w-full h-16 justify-start text-left py-[8px] px-[16px]', JSON.stringify(typeValue) === `[]` && 'border border-[#f23250]')}>
                        <div className='w-full border-black rounded-full border-4' />
                    </Button>
                    
                    <Button  
                    onClick={() => onChangeStrokeType([5,5])} 
                    variant="secondary" size="lg" 
                    className={cn('w-full h-16 justify-start text-left py-[8px] px-[16px]', JSON.stringify(typeValue) === `[5,5]` && 'border border-[#f23250]')}>
                        <div className='w-full border-black rounded-full border-4 border-dashed' />
                    </Button>
                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    )
};
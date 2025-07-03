"use client";

import { SidebarItem } from "@/components/sidebar-items";
import { LayoutTemplate, ImageIcon, Pencil, Presentation, Settings, Shapes, Sparkles, Type } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ActiveTool, Editor, FILL_COLOR, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH } from "../types";
import { cn } from "@/lib/utils";
import { ShapeTool } from './shape-tool';
import { FaCircle, FaSquare, FaSquareFull } from 'react-icons/fa';
import { IoTriangle } from 'react-icons/io5';
import { FaDiamond } from 'react-icons/fa6';
import { useMemo, useEffect } from "react";
import { ColorPicker } from "@/features/editor/components/color-picker";
import { Slider } from '@/components/ui/slider';
import { useGenerateImage } from "@/features/ai/api/use-generate-image";

interface SidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const canvasPresets = [
    { label: "Custom", width: "", height: "" },
    { label: "Instagram Post", width: "1080", height: "1080" },
    { label: "Instagram Story", width: "1080", height: "1920" },
    { label: "Facebook Post", width: "1200", height: "630" },
    { label: "Facebook Story", width: "1080", height: "1920" },
    { label: "Instagram Ad", width: "1080", height: "1080" },
    { label: "Facebook Ad", width: "1200", height: "628" },
];

export const RightSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: SidebarProps) => {
    const workspace = editor?.getWorkspace();
    const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
    const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
    const initialBackground = useMemo(() => workspace?.fill ?? "#ffffff", [workspace]);
    const initialOpacity = editor?.getActiveOpacity() || 1;
    const fillColorValue = editor?.getActiveFillColor() || FILL_COLOR;
    const strokeColorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
    const strokeWidthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
    const strokeTypeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;
    
    const mutation = useGenerateImage();
    const [aiPrompt, setAiPrompt] = useState("");

    const [canvasWidth, setCanvasWidth] = useState(initialWidth);
    const [canvasHeight, setCanvasHeight] = useState(initialHeight);
    const [selectedPreset, setSelectedPreset] = useState("Custom");
    const [background, setBackground] = useState(initialBackground);
    const [opacity, setOpacity] = useState(initialOpacity);
    
    const selectedObject = useMemo(() => editor?.selectedObjects[0], [editor?.selectedObjects]);

    useEffect(() => {
        setCanvasWidth(initialWidth);
        setCanvasHeight(initialHeight);
        setBackground(initialBackground);
    }, [initialWidth, initialHeight, initialBackground]);

    useEffect(() => {
        if (selectedObject) {
            setOpacity(selectedObject.get("opacity") || 1);
        }
    }, [selectedObject]);

    const changeWidth = (value: string) => setCanvasWidth(value);
    const changeHeight = (value: string) => setCanvasHeight(value);
    const changeBackground = (value: string) => {
        setBackground(value);
        editor?.changeBackground(value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        editor?.changeSize({
            width: parseInt(canvasWidth, 10),
            height: parseInt(canvasHeight, 10),
        });
    };

    const onOpacityChange = (value: number) => {
        editor?.changeOpacity(value);
        setOpacity(value);
    };

    const onFillColorChange = (value: string) => {
        editor?.changeFillColor(value);
    };

    const onStrokeColorChange = (value: string) => {
        editor?.changeStrokeColor(value);
    };

    const onChangeStrokeWidth = (value: number) => {
        editor?.changeStrokeWidth(value);
    };

    const onChangeStrokeType = (value: number[]) => {
        editor?.changeStrokeDashArray(value);
    };

    const onAiSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({ prompt: aiPrompt }, {
            onSuccess: ({ data }) => {
                // @ts-ignore
                editor?.addImage(data);
            }
        });
    };

    const handlePresetChange = (preset: typeof canvasPresets[0]) => {
        setSelectedPreset(preset.label);
        setCanvasWidth(preset.width);
        setCanvasHeight(preset.height);
    };

    return (
        <aside className="glass flex flex-col gap-2 w-[300px] border-r h-full overflow-y-hidden p-2 ">
    
            {/* Stroke Width Section - Only shows when stroke-width tool is active */}
            {activeTool === "stroke-width" && (
                <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                    <h2 className="text-sm font-medium text-white/80">📏 Border Width</h2>
                    <p className="text-xs text-white/60 mb-2">Modify the border width of the object</p>
                    
                    {/* Border Width Slider */}
                    <div className="w-full space-y-2">
                        <h3 className="text-xs font-medium text-white/60">Border Width</h3>
                        <Slider 
                            value={[strokeWidthValue]}
                            onValueChange={(values) => onChangeStrokeWidth(values[0])}
                            max={50}
                            min={0}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-white/60 mt-1">
                            <span>0px</span>
                            <span>{strokeWidthValue}px</span>
                            <span>50px</span>
                        </div>
                    </div>

                    {/* Border Type */}
                    <div className="w-full space-y-2">
                        <h3 className="text-xs font-medium text-white/60">Border Type</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => onChangeStrokeType([])}
                                className={cn(
                                    'w-full h-12 flex items-center justify-center p-2 glass-subtle hover:bg-white/10 transition-colors rounded',
                                    JSON.stringify(strokeTypeValue) === `[]` && 'ring-2 ring-blue-400/50'
                                )}
                            >
                                <div className='w-full h-1 bg-white/80 rounded-full' />
                            </button>
                            
                            <button
                                onClick={() => onChangeStrokeType([5,5])}
                                className={cn(
                                    'w-full h-12 flex items-center justify-center p-2 glass-subtle hover:bg-white/10 transition-colors rounded',
                                    JSON.stringify(strokeTypeValue) === `[5,5]` && 'ring-2 ring-blue-400/50'
                                )}
                            >
                                <div className='w-full h-1 bg-white/80 rounded-full' style={{backgroundImage: 'repeating-linear-gradient(to right, white 0, white 5px, transparent 5px, transparent 10px)'}} />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Stroke Color Section - Only shows when stroke-color tool is active */}
            {activeTool === "stroke-color" && (
                <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                    <h2 className="text-sm font-medium text-white/80">🖌️ Stroke Color</h2>
                    <p className="text-xs text-white/60 mb-2">Add stroke color to your element</p>
                    <div className="w-full">
                        <ColorPicker
                            value={strokeColorValue}
                            onChange={onStrokeColorChange}
                        />
                    </div>
                </section>
            )}

            {/* Fill Color Section - Only shows when fill tool is active */}
            {activeTool === "fill" && (
                <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                    <h2 className="text-sm font-medium text-white/80">🎨 Fill Color</h2>
                    <p className="text-xs text-white/60 mb-2">Add fill color to your element</p>
                    <div className="w-full">
                        <ColorPicker
                            value={fillColorValue}
                            onChange={onFillColorChange}
                        />
                    </div>
                </section>
            )}

            {/* Opacity Section - Only shows when opacity tool is active */}
            {activeTool === "opacity" && (
                <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                    <h2 className="text-sm font-medium text-white/80">🔍 Opacity</h2>
                    <p className="text-xs text-white/60 mb-2">Change the opacity of the selected object</p>
                    <div className="w-full">
                        <Slider 
                            value={[opacity]}
                            onValueChange={(values) => onOpacityChange(values[0])}
                            max={1}
                            min={0}
                            step={0.01}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-white/60 mt-1">
                            <span>0%</span>
                            <span>{Math.round(opacity * 100)}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </section>
            )}

            {/* AI Section - Only shows when ai tool is active */}
            <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                    <h2 className="text-sm font-medium text-white/80">🤖 AI Generate</h2>
                    <p className="text-xs text-white/60 mb-2">Generate an image using AI</p>
                    
                    <form onSubmit={onAiSubmit} className="w-full space-y-3">
                        <textarea
                            disabled={mutation.isPending}
                            placeholder="An astronaut riding a horse on mars, hd, dramatic lighting"
                            rows={4}
                            required
                            minLength={3}
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none"
                        />
                        <button
                            disabled={mutation.isPending}
                            type="submit"
                            className="w-full px-3 py-2 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 disabled:opacity-50"
                        >
                            {mutation.isPending ? "Generating..." : "Generate Image"}
                        </button>
                    </form>
                </section>

            {/* Main Sidebar Items */}

            <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                <h2 className="text-sm font-medium text-white/80">✏️ Add Text</h2>

                <section className="flex items-center justify-center cursor-pointer p-1 glass-subtle w-full hover:bg-white/10 transition-all duration-200">
                    <h2 className="text-xs font-medium text-white/80 mb-0" 
                        onClick={() => editor?.addText("Heading", { fontSize: 80, fontWeight: 700, })}>
                        Add Heading
                    </h2>
                </section>
                <section className="flex items-center justify-center cursor-pointer p-1 glass-subtle w-full hover:bg-white/10 transition-all duration-200">
                    <h2 className="text-xs font-medium text-white/80 mb-0"
                        onClick={() => editor?.addText("Subheading", { fontSize: 44, fontWeight: 500, })}>
                        Add Subheading
                    </h2>
                </section>
                <section className="flex items-center justify-center cursor-pointer p-1 glass-subtle w-full hover:bg-white/10 transition-all duration-200">
                    <h2 className="text-xs font-medium text-white/80 mb-0"
                        onClick={() => editor?.addText("Paragraph", { fontSize: 32 })}>
                        Add Paragraph
                    </h2>
                </section>
            </section>

            <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                <h2 className="text-sm font-medium text-white/80">🔶 Add Shapes</h2>

                {/* First row of shapes */}
                <div className="grid grid-cols-3 gap-2 w-full">
                    <ShapeTool onclick={() => editor?.addCircle()} icon={FaCircle}/>
                    <ShapeTool onclick={() => editor?.addSoftRectangle()} icon={FaSquare}/>
                    <ShapeTool onclick={() => editor?.addSquare()} icon={FaSquareFull}/>
                </div>

                {/* Second row of shapes */}
                <div className="grid grid-cols-3 gap-2 w-full">
                    <ShapeTool onclick={() => editor?.addTriangle()} icon={IoTriangle}/>
                    <ShapeTool onclick={() => editor?.addTriangleInverse()} iconClassName='rotate-180' icon={IoTriangle}/>
                    <ShapeTool onclick={() => editor?.addDiamond()} icon={FaDiamond}/>
                </div>
            </section>

            <section className="flex items-start justify-between gap-2 p-2 glass-subtle flex-col">
                <h2 className="text-sm font-medium text-white/80">⚙️ Edit Canvas</h2>

                {/* Canvas Size */}
                <form className="w-full space-y-2" onSubmit={onSubmit}>
                    <h3 className="text-xs font-medium text-white/60">Canvas Size</h3>
                    
                    {/* Presets Dropdown */}
                    <select 
                        value={selectedPreset}
                        onChange={(e) => {
                            const preset = canvasPresets.find(p => p.label === e.target.value);
                            if (preset) handlePresetChange(preset);
                        }}
                        className="w-full px-2 py-1.5 text-xs bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/40"
                    >
                        {canvasPresets.map((preset) => (
                            <option key={preset.label} value={preset.label} className="bg-gray-800 text-white">
                                {preset.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2 w-fit">
                        <input 
                            type="number" 
                            placeholder="Width"
                            value={canvasWidth}
                            onChange={(e) => changeWidth(e.target.value)}
                            className="w-[30%] flex-1 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        />
                        <span className="text-white/60 text-xs flex items-center">×</span>
                        <input 
                            type="number" 
                            placeholder="Height"
                            value={canvasHeight}
                            onChange={(e) => changeHeight(e.target.value)}
                            className="w-[30%] flex-1 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        />
                    </div>
                    <button type="submit" className="w-full px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-400/30 rounded text-blue-200 hover:bg-blue-500/30 transition-colors">
                        Confirm
                    </button>
                </form>

                {/* Background Color */}
                <div className="w-full space-y-2">
                    <h3 className="text-xs font-medium text-white/60">Canvas Background Color</h3>
                    <ColorPicker
                        value={background as string}
                        onChange={changeBackground}
                    />
                </div>
            </section>
        </aside>
    );
};
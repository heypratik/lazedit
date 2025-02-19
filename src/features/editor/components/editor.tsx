"use client";

import { useEditor } from "@/features/editor/hooks/use-editor";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Navbar } from "@/features/editor/components/navbar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import { ActiveTool, selectionDependentTools } from "@/features/editor/types";
import { ShapeSidebar } from "@/features/editor/components/shape-sidebar";
import { FillColorSidebar } from "./fill-color-sidebar";
import { StrokeColorSidebar } from "./stroke-color-sidebar"
import { StrokeWidthSidebar } from "./stroke-width-sidebar";
import { OpacitySidebar } from "./opacity-sidebar";
import { TextSidebar } from "./text-sidebar";
import { FontSidebar } from "./font-sidebar";
import { IoBackspaceOutline } from "react-icons/io5";
import { RemoveBgSidebar } from "./remove-bg-sidebar";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"
import { RiSendBackward, RiBringForward } from "react-icons/ri";
import { ImageSideBar } from "./image-sidebar";
import { FilterSidebar } from "./filter-sidebar";
import { AiSidebar } from "./ai-sidebar";
import { DrawSidebar } from "./draw-sidebar";
import { SettingsSidebar } from "./settings-sidebar";
import { useUpdateProject } from "@/app/editor/hooks/use-update-project";
import debounce from "lodash.debounce";

interface EditorProps {
  initialData?: any;
  store?: any;
}

export const Editor = ({initialData, store}: EditorProps) => {

  const {mutate} = useUpdateProject(initialData.id);

  const debounceSave = useCallback(
    debounce((values: {
    json: string,
    height: number,
    width: number,
  }) => {
    // @ts-ignore
    mutate(values)
  }, 1000), [mutate]);

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onClearSelection = useCallback(() => {

    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
    
  }, [activeTool]);

  const { init, editor } = useEditor({
    defaultState: initialData.json,
    defaultHeight: initialData.height,
    defaultWidth: initialData.width,
    clearSelectionCallback: onClearSelection,
    saveCallback: debounceSave,
  });

  const onChangeActiveTool = useCallback((tool: ActiveTool) => {


    if (tool === "draw") {
      editor?.enableDrawingMode();
    }

    if (activeTool === "draw") {
      editor?.disableDrawingMode();
    }

    if (tool === activeTool) {
      return setActiveTool("select");
    } 

    setActiveTool(tool);

  } , [activeTool, editor]);

  const canvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]); 

  const menuClass = "text-base cursor-pointer flex items-center justify-between";

  return (
    <div className="h-full flex flex-col">
      <Navbar editor={editor}  activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} id={initialData?.id} name={initialData.name}/>
      <div className=" absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <ShapeSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <FillColorSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <StrokeColorSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <StrokeWidthSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <OpacitySidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <TextSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <FontSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <ImageSideBar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} store={store}/>
        <FilterSidebar  editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <AiSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <RemoveBgSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <DrawSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <SettingsSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool}/>
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(
              editor?.canvas.getActiveObject()
            )}
          />
          <div className="flex-1 bg-muted h-[calc(100% - 124px )]" ref={containerRef}>
           
            <ContextMenu>
  <ContextMenuTrigger  className="flex h-[150px] w-[300px]"> <canvas ref={canvasRef} /></ContextMenuTrigger>
  <ContextMenuContent className=" w-72 text-lg cursor-pointer">
    <ContextMenuItem className={menuClass} disabled={(editor?.selectedObjects?.length ?? 0) < 1} onClick={() => editor?.copy()}>Copy</ContextMenuItem>
    <ContextMenuItem className={menuClass} onClick={() => editor?.paste()}>Paste</ContextMenuItem>
    <ContextMenuItem className={menuClass} disabled={(editor?.selectedObjects?.length ?? 0) < 1} onClick={() => {
      editor?.copy();
      editor?.paste();
    }}>Duplicate</ContextMenuItem>
    <ContextMenuSeparator />
  <ContextMenuSub>
          <ContextMenuSubTrigger className={menuClass} >Layers</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem  className={menuClass} disabled={(editor?.selectedObjects?.length ?? 0) < 1} onClick={() => editor?.bringForward()}>Bring forward
              <ContextMenuShortcut><RiBringForward className="ml-3" size="20" color="#000"/></ContextMenuShortcut></ContextMenuItem>
            <ContextMenuItem  className={menuClass} disabled={(editor?.selectedObjects?.length ?? 0) < 1} onClick={() => editor?.sendBackwards()}>Send backward
              <ContextMenuShortcut><RiSendBackward className="ml-3" size="20" color="#000"/></ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
    <ContextMenuItem className={menuClass} disabled={(editor?.selectedObjects?.length ?? 0) < 1} onClick={() => editor?.delete()}>Delete<IoBackspaceOutline className="ml-3" size="20" color="#dc2626 "/></ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  ); 
};

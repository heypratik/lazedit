"use client";

import { ActiveTool, Editor, FONT_SIZE } from "../types";
import { useState, useCallback, MouseEvent, useEffect, useRef } from "react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BsBorderWidth } from "react-icons/bs";
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, ChevronDown, Copy, SquareSplitHorizontal, Trash } from "lucide-react";
import { RxTransparencyGrid } from "react-icons/rx";
import { isTextType } from "../utils";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { FONT_WEIGHT } from "../types";
import { FontSizeInput } from "./font-size-input";
import {TbColorFilter} from "react-icons/tb";

const TOOLBAR_STORAGE_KEY = 'editor-toolbar-position';
const DEFAULT_POSITION = { x: 100, y: 30 };

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

interface Position {
  x: number;
  y: number;
}

const getSavedPosition = (): Position => {
  if (typeof window === 'undefined') return DEFAULT_POSITION;
  
  try {
    const saved = localStorage.getItem(TOOLBAR_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate the saved position is within viewport
      if (parsed.x >= 0 && parsed.x <= window.innerWidth - 200 && 
          parsed.y >= 0 && parsed.y <= window.innerHeight - 50) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading toolbar position from localStorage:', error);
  }
  
  return DEFAULT_POSITION;
};

const savePosition = (position: Position) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEY, JSON.stringify(position));
  } catch (error) {
    console.error('Error saving toolbar position to localStorage:', error);
  }
};

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  
  const strokeColor = editor?.getActiveStrokeColor();
  const fontFamily = editor?.getActiveFontFamily();
  const fillColor = editor?.getActiveFillColor();
  const fontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const fontStyle = editor?.getActiveFontStyle() || "normal";
  const linethrough = editor?.getActiveFontLinethrough();
  const fontUnderline = editor?.getActiveFontUnderline();
  const textAlign = editor?.getActiveTextAlign();
  const fontSize = editor?.getActiveFontSize() || FONT_SIZE;

  const [properties, setProperties] = useState({
    fillColor: fillColor,
    strokeColor: strokeColor,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    fontLinethrough: linethrough,
    fontUnderline: fontUnderline,
    textAlign: textAlign,
    fontSize: fontSize,
  });

  // State for tracking toolbar width and position
  const [toolbarWidth, setToolbarWidth] = useState(0);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = getSavedPosition();
    setPosition(savedPosition);
  }, []);

  // Calculate toolbar width on mount and when content changes
  useEffect(() => {
    if (toolbarRef.current) {
      const updateWidth = () => {
        const width = toolbarRef.current?.offsetWidth || 0;
        setToolbarWidth(width);
      };

      updateWidth();

      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(toolbarRef.current);

      return () => {
        if (toolbarRef.current) {
          resizeObserver.unobserve(toolbarRef.current);
        }
      };
    }
  }, [editor?.selectedObjects[0]?.type]);

  // Set initial centered position if no saved position
  useEffect(() => {
    if (typeof window !== 'undefined' && toolbarWidth > 0) {
      const savedPosition = getSavedPosition();
      if (savedPosition === DEFAULT_POSITION) {
        setPosition({
          x: (window.innerWidth - toolbarWidth) / 2,
          y: 30
        });
      }
    }
  }, [toolbarWidth]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('toolbar-drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      
      // Ensure toolbar stays within viewport bounds
      const maxX = window.innerWidth - (toolbarWidth || 200);
      const maxY = window.innerHeight - 50;
      
      newPosition.x = Math.max(0, Math.min(newPosition.x, maxX));
      newPosition.y = Math.max(0, Math.min(newPosition.y, maxY));
      
      setPosition(newPosition);
      savePosition(newPosition);
      e.preventDefault();
    }
  }, [isDragging, dragOffset, toolbarWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = selectedObject?.type;
  const isText = isTextType(selectedObjectType);
  const isImage = selectedObjectType === "image";

  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) return;
    editor?.changeTextAlign(value);
    setProperties((prev) => ({ ...prev, textAlign: value }));
  }

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) return;
    editor?.changeFontSize(value);
    setProperties((prev) => ({ ...prev, fontSize: value }));
  }

  const toggleBold = () => {
    if (!selectedObject) return;
    const newValue = properties.fontWeight > 500 ? 500 : 700;
    editor?.changeFontWeight(newValue);
    setProperties((prev) => ({ ...prev, fontWeight: newValue }));
  }

  const toggleItalic = () => {
    if (!selectedObject) return;
    const newValue = properties.fontStyle === "italic" ? "normal" : "italic";
    editor?.changeFontStyle(newValue);
    setProperties((prev) => ({ ...prev, fontStyle: newValue }));
  }

  const togglLinethrough = () => {
    if (!selectedObject) return;
    const newValue = !properties.fontLinethrough;
    editor?.changeFontLinethrough(newValue);
    setProperties((prev) => ({ ...prev, fontLinethrough: newValue }));
  }

  const toggleUnderline = () => {
    if (!selectedObject) return;
    const newValue = !properties.fontUnderline;
    editor?.changeFontUnderline(newValue);
    setProperties((prev) => ({ ...prev, fontUnderline: newValue }));
  }

  if (editor?.selectedObjects.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed bg-white border rounded-[50px] p-2",
        "flex items-center gap-x-2 shadow-md",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        "z-50"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none"
      }}
    >
      {/* Drag handle */}
      <div 
        className="toolbar-drag-handle absolute inset-0 rounded-[50px]"
        onMouseDown={handleMouseDown}
      />

      <div className="flex items-center gap-x-2 relative">
        {!isImage && <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("fill")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "fill" && "bg-gray-100")}
          >
            <div
              className="rounded-sm size-4 border"
              style={{ backgroundColor: properties.fillColor }}
            />
          </Button>
        </Hint>}

        {!isText && (
          <Hint label="Border Color" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-color")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "stroke-color" && "bg-gray-100")}
            >
              <div
                className="rounded-sm size-4 border-2 bg-white"
                style={{ borderColor: properties.strokeColor }}
              />
            </Button>
          </Hint>
        )}

        {!isText && (
          <Hint label="Border Options" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-width")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "stroke-width" && "bg-gray-100")}
            >
              <BsBorderWidth className="size-4" />
            </Button>
          </Hint>
        )}

        {isText && (
          <>
            <Hint label="Font" side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool("font")}
                size="icon"
                variant="ghost"
                className={cn("w-auto px-2 text-sm", activeTool === "font" && "bg-gray-100")}
              >
                <div className="max-w-[100px] truncate">{properties.fontFamily}</div>
                <ChevronDown className="size-4 ml-2 shrink-0" />
              </Button>
            </Hint>

            <Hint label="Bold" side="bottom" sideOffset={5}>
              <Button
                onClick={toggleBold}
                size="icon"
                variant="ghost"
                className={cn(properties.fontWeight > 500 && "bg-gray-100")}
              >
                <FaBold className="size-4" />
              </Button>
            </Hint>

            <Hint label="Italic" side="bottom" sideOffset={5}>
              <Button
                onClick={toggleItalic}
                size="icon"
                variant="ghost"
                className={cn(properties.fontStyle === "italic" && "bg-gray-100")}
              >
                <FaItalic className="size-4" />
              </Button>
            </Hint>

            <Hint label="Strikethrough" side="bottom" sideOffset={5}>
              <Button
                onClick={togglLinethrough}
                size="icon"
                variant="ghost"
                className={cn(properties.fontLinethrough && "bg-gray-100")}
              >
                <FaStrikethrough className="size-4" />
              </Button>
            </Hint>

            <Hint label="Underline" side="bottom" sideOffset={5}>
              <Button
                onClick={toggleUnderline}
                size="icon"
                variant="ghost"
                className={cn(properties.fontUnderline && "bg-gray-100")}
              >
                <FaUnderline className="size-4" />
              </Button>
            </Hint>

            <div className="flex gap-x-0.5">
              <Hint label="Align Left" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeTextAlign("left")}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.textAlign === "left" && "bg-gray-100")}
                >
                  <AlignLeft className="size-4" />
                </Button>
              </Hint>

              <Hint label="Align Center" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeTextAlign("center")}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.textAlign === "center" && "bg-gray-100")}
                >
                  <AlignCenter className="size-4" />
                </Button>
              </Hint>

              <Hint label="Align Right" side="bottom" sideOffset={5}>
                <Button
                  onClick={() => onChangeTextAlign("right")}
                  size="icon"
                  variant="ghost"
                  className={cn(properties.textAlign === "right" && "bg-gray-100")}
                >
                  <AlignRight className="size-4" />
                </Button>
              </Hint>
            </div>

            <FontSizeInput 
              value={properties.fontSize}
              onChange={onChangeFontSize}
            />
          </>
        )}

        {isImage && (
          <Hint label="Filter" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("filter")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "filter" && "bg-gray-100")}
          >
            <TbColorFilter className="size-4" />
          </Button>
        </Hint>
        )}

{isImage && (
          <Hint label="Remove BG" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("remove-bg")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "remove-bg" && "bg-gray-100")}
          >
            <SquareSplitHorizontal className="size-4" />
          </Button>
        </Hint>
        )}

        

        <Hint label="Bring Forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>

        <Hint label="Send Backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>

        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>

        {!isImage && (
          <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={() => {
              editor?.copy();
              editor?.paste();
            }}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
        )}

        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.delete()}
            size="icon"
            variant="ghost"
          >
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
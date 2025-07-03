"use client";

import { SidebarItem } from "@/components/sidebar-items";
import { LayoutTemplate, ImageIcon, Pencil, Presentation, Settings, Shapes, Sparkles, Type } from "lucide-react";
import { ActiveTool } from "../types";

interface SidebarProps {
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}


export const Sidebar = ({
    activeTool,
    onChangeActiveTool,
}: SidebarProps) => {
    return (
        <aside className="glass flex flex-col w-[100px] border-r h-full overflow-y-auto">
            <ul className="flex flex-col !p-0 !m-0">
                <SidebarItem icon={LayoutTemplate} label="Design" isActive={activeTool === "templates"} onClick={() => onChangeActiveTool("templates")} />
                <SidebarItem icon={ImageIcon} label="Image" isActive={activeTool === "images"} onClick={() => onChangeActiveTool("images")} />
                <SidebarItem icon={Type} label="Text" isActive={activeTool === "text"} onClick={() => onChangeActiveTool("text")} />
                <SidebarItem icon={Shapes} label="Shapes" isActive={activeTool === "shapes"} onClick={() => onChangeActiveTool("shapes")} />
                <SidebarItem icon={Pencil} label="Draw" isActive={activeTool === "draw"} onClick={() => onChangeActiveTool("draw")} />
                <SidebarItem icon={Sparkles} label="AI" isActive={activeTool === "ai"} onClick={() => onChangeActiveTool("ai")} />
                <SidebarItem icon={Settings} label="Settings" isActive={activeTool === "settings"} onClick={() => onChangeActiveTool("settings")} />
                {/* <SidebarItem icon={Pencil} label="Pencil" isActive={activeTool === "Pencil"} onClick={() => onChangeActiveTool("Pencil")} />
                <SidebarItem icon={Presentation} label="Presentation" isActive={activeTool === "Presentation"} onClick={() => onChangeActiveTool("Presentation")} /> */}
            </ul>
        </aside>
    )};
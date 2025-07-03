import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {cn } from "@/lib/utils";

interface ShapeToolProps {
    icon: LucideIcon | IconType;
    onclick: () => void;
    iconClassName?: string;
}

export const ShapeTool = ({ icon: Icon, onclick, iconClassName }: ShapeToolProps) => {
    return (
        <button
            className="aspect-square border rounded-md p-5 glass-subtle hover:bg-white/10"
            onClick={onclick}
        >
            <Icon className={cn("h-full w-full text-white/80", iconClassName)} />
        </button>
    );
}
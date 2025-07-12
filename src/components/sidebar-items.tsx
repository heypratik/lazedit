import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

export const SidebarItem = ({ icon: Icon, label, isActive, onClick }: SidebarItemProps) => {
    return (
            <button
                className={cn(
                    "w-full h-full aspect-video p-4 text-white hover:glass-subtle-no-border flex flex-col items-center justify-center gap-2 rounded-none",
                    isActive && "w-full h-full aspect-video p-4 text-white glass-subtle-no-border flex flex-col items-center justify-center gap-2 rounded-none"
                )}
                onClick={onClick}
            >
                <Icon className="size-4 stroke-2 shrink-0" />
                {/* <span className="mt-0 text-xs font-medium">{label}</span> */}
            </button>
    );
}
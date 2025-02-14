interface ToolSidebarHeaderProps {
    title: string;
    description?: string;
}

export const ToolSidebarHeader = ({ title, description }: ToolSidebarHeaderProps) => {
    return (
        <header className="p-4 border-b space-y-1 h-[68px]">
            <h2 className="text-sm font-medium">{title}</h2>
            {description && <p className="text-xs">{description}</p>}
        </header>
    );
}
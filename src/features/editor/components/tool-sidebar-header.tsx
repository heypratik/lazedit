interface ToolSidebarHeaderProps {
    title: string;
    description?: string;
}

export const ToolSidebarHeader = ({ title, description }: ToolSidebarHeaderProps) => {
    return (
        <header className="p-3 border-b space-y-1">
            <h2 className="text-sm font-medium">{title}</h2>
            {description && <p className="text-xs">{description}</p>}
        </header>
    );
}
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

export const Hint = ({
  label,
  children,
  side = "top",
  align = "center",
  sideOffset = 0,
  alignOffset = 0,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-white/80 p-0 cursor-pointer z-[100] transition-all duration-200 backdrop-blur-[50px]"
          style={{ background: "rgba(0, 0, 0, 0.7)", border: "1px solid rgba(255, 255, 255, 0.05)" }}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <p className="font-semibold capitalize !m-0 glass-strong px-2 py-1">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FontSizeInputProps {
    value: number;
    onChange: (value: number) => void;
}

export const FontSizeInput = ({ value, onChange }: FontSizeInputProps) => {

    const increment = () => {
        onChange(value + 1);
    }

    const decrement = () => {
        if (value <= 0) {
            return;
        }
        onChange(value - 1);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        // If the value is not a number, return

        if (isNaN(parseInt(e.target.value, 10))) {
            return;
        }

        // if negative value, return
        if (parseInt(e.target.value, 10) < 0) {
            return;
        }

        onChange(parseInt(e.target.value, 10));
    }
    return (
        <div className="flex items-center">
            <Button
            size="icon"
                variant="outline"
                className="p-2 rounded-r-none border-r-0 "
                onClick={decrement}
            >
                <Minus className="size-4" />
            </Button>
            <Input
            className="w-[50px] h-8 focus-visible:ring-offset-0 rounded-none focus-visible:ring-0"
                value={value}
                onChange={handleChange}
            />
            <Button
            size="icon"
                variant="outline"
                className="p-2 rounded-l-none border-l-0 "
                onClick={increment}
            >
                <Plus className="size-4" />
            </Button>
        </div>
    );
};
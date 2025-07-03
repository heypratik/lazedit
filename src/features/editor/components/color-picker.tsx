import {ChromePicker, CirclePicker} from 'react-color';
import { colors } from '../types';
import { rgbaObjectToString } from '../utils';

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export const ColorPicker = ({value, onChange}: ColorPickerProps) => {
    return (
        <div className='flex flex-col space-y-4'>
            {/* <ChromePicker color={value} onChange={(color) => {
                const formattedValue = rgbaObjectToString(color.rgb);
                onChange(formattedValue);
            }} className='border rounded-lg !w-full' /> */}
            <div className="flex items-center gap-2">
                                    <input 
                            type="color" 
                            defaultValue="#ffffff"
                            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        <span className="text-xs text-white/60">Select color</span>
                    </div>
{/* 
            <CirclePicker colors={colors} color={value} className='!w-full mt-4' onChangeComplete={(color) => {
                const formattedValue = rgbaObjectToString(color.rgb);
                onChange(formattedValue);
            }} /> */}
        </div>
    )
}  
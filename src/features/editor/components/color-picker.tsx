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
            <ChromePicker color={value} onChange={(color) => {
                const formattedValue = rgbaObjectToString(color.rgb);
                onChange(formattedValue);
            }} className='border rounded-lg !w-full' />
            <CirclePicker colors={colors} color={value} className='!w-full mt-4' onChangeComplete={(color) => {
                const formattedValue = rgbaObjectToString(color.rgb);
                onChange(formattedValue);
            }} />
        </div>
    )
}  
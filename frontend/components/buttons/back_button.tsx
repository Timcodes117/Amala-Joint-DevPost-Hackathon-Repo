import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { global_style } from '../../utils/stylesheets/general_style';
import { input_style } from '../../utils/stylesheets/input_style';
import { color_scheme } from '../../utils/constants/app_constants';
import { ChevronLeft } from 'lucide-react-native';


interface BackBtnProps {
    onTap: (value?: string) => void;
    value?: string;

}

const BackButton = (props: BackBtnProps) => {
    return (
        <TouchableOpacity
            style={[global_style.centered, input_style.input_container,   { height: 48, width: 48, borderColor: color_scheme.outline, borderRadius: 100, backgroundColor: color_scheme.light }]} onPress={() => props.onTap(props.value)}>
            <ChevronLeft size={24} color={color_scheme.text_color} />
        </TouchableOpacity>
    )
}

export default BackButton
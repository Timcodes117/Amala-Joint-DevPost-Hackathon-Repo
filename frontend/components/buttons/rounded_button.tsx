import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import React, { Children } from 'react'
import { global_style } from '../../utils/stylesheets/general_style';
import { input_style } from '../../utils/stylesheets/input_style';
import { color_scheme } from '../../utils/constants/app_constants';
import { ChevronLeft } from 'lucide-react-native';


interface RoundedBtnProps {
    onTap?: (value?: string) => void;
    value?: string;
    children?: React.ReactNode;
    overrideStyle?: ViewStyle;

}

const RoundButton = ({ overrideStyle,...props}: RoundedBtnProps) => {
    return (
        <TouchableOpacity
            style={[global_style.centered, input_style.input_container, { height: 40, width: 40, borderColor: color_scheme.outline, borderRadius: 100, ...overrideStyle }]} onPress={() => props.onTap}>
            {props.children}
        </TouchableOpacity>
    )
}

export default RoundButton;
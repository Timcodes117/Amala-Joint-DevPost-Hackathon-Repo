import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { global_style } from '../../utils/stylesheets/general_style';
import { input_style } from '../../utils/stylesheets/input_style';
import { color_scheme } from '../../utils/constants/app_constants';


interface WideBtnProps{
   children?: React.ReactNode,
    onTap: (value?: string) => void;
    value?: string;
    type?: "fill" | "outlined"
}

const WideButton = ({type="fill", children, ...props}:WideBtnProps) => {
  return (
    <TouchableOpacity
          style={[global_style.centered, type === "fill" ? input_style.input_container_fill : input_style.input_container, { height: 48, borderColor: color_scheme.dark_outline, borderRadius: 100 }]} onPress={() => props.onTap(props.value)}>
          <Text style={[global_style.text, {color: type == "fill" ? color_scheme.light : color_scheme.dark}]}>{children}</Text>
        </TouchableOpacity>
  )
}

export default WideButton
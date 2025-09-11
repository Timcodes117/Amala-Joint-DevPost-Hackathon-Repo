import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { global_style } from '../../utils/stylesheets/general_style';
import { input_style } from '../../utils/stylesheets/input_style';
import { color_scheme } from '../../utils/constants/app_constants';


interface ShortBtnProps {
  children?: React.ReactNode,
  onTap: (value?: string) => void;
  value?: string;
  type?: "fill" | "outlined"
}

const ShortButton = ({ type = "fill", children, ...props }: ShortBtnProps) => {
  return (
    <TouchableOpacity
      style={[global_style.centered, type === "fill" ? input_style.input_container_fill : input_style.input_container, { height: 48, width: 97, borderColor: color_scheme.dark_outline, borderRadius: 100 }]} onPress={() => props.onTap(props.value)}>
      <Text style={[global_style.text, {color: type == "fill" ? color_scheme.light : color_scheme.dark}]}>{children}</Text>
    </TouchableOpacity>
  )
}

export default ShortButton
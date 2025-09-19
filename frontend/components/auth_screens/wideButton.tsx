import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { global_style } from '../../utils/stylesheets/general_style';
import { input_style } from '../../utils/stylesheets/input_style';
import { color_scheme } from '../../utils/constants/app_constants';


interface WideBtnProps{
   children?: React.ReactNode,
    onTap: (value?: string) => void;
    value?: string;
    type?: "fill" | "outlined";
    fillColor?: string;
    disabled?: boolean;
    loading?: boolean;
}

const WideButton = ({type="fill", children, loading=false, ...props}:WideBtnProps) => {
  const isDisabled = props.disabled || loading;
  
  return (
    <TouchableOpacity
          style={[
            global_style.centered, 
            type === "fill" ? input_style.input_container_fill : input_style.input_container, 
            { 
              height: 48, 
              borderColor: color_scheme.dark_outline, 
              borderRadius: 100, 
              backgroundColor: props.fillColor || undefined,
              opacity: isDisabled ? 0.6 : 1
            }
          ]} 
          onPress={() => !isDisabled && props.onTap(props.value)}
          disabled={isDisabled}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {loading && (
              <ActivityIndicator 
                size="small" 
                color={type === "fill" ? color_scheme.light : color_scheme.dark} 
              />
            )}
            <Text style={[global_style.text, {color: type == "fill" ? color_scheme.light : color_scheme.dark}]}>
              {children}
            </Text>
          </View>
        </TouchableOpacity>
  )
}

export default WideButton
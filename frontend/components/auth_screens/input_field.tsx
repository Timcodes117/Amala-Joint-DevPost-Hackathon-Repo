import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { input_style } from '../../utils/stylesheets/input_style'
import { global_style } from '../../utils/stylesheets/general_style';
import { color_scheme } from '../../utils/constants/app_constants';
import { Eye, EyeOff } from 'lucide-react-native';


interface TextInputProps {
    placeHolder: string,
    value?: string,
    onChangeText?: (text: string) => void;
    onChange?: (text: string) => void;
    obscureText?: boolean,
    showPasswordToggle?: boolean,
    type:  'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url'
    | 'password';
}

export default function CircularInputField(props: Partial<TextInputProps>) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const handleTextChange = (text: string) => {
        if (props.onChangeText) {
            props.onChangeText(text);
        } else if (props.onChange) {
            props.onChange(text);
        }
    };

    const isPassword = props.type === 'password' || props.obscureText;
    const inputMode = isPassword ? 'text' : (props.type === 'password' ? 'text' : props.type);
    const shouldShowToggle = isPassword && props.showPasswordToggle;

    return (
        <View style={[input_style.input_container, { borderRadius: 100, padding: 5, minHeight: 50, flexDirection: 'row', alignItems: 'center' }]}>
            <TextInput
                style={[global_style.text, { flex: 1 }]}
                placeholder={props.placeHolder ?? "Type something..."}
                placeholderTextColor={color_scheme.placeholder_color}
                value={props.value}
                inputMode={inputMode}
                secureTextEntry={isPassword && !isPasswordVisible}
                onChangeText={handleTextChange} />
            
            {shouldShowToggle && (
                <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{ padding: 8 }}
                >
                    {isPasswordVisible ? (
                        <EyeOff size={20} color={color_scheme.placeholder_color} />
                    ) : (
                        <Eye size={20} color={color_scheme.placeholder_color} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    )
}
import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { input_style } from '../../utils/stylesheets/input_style'
import { global_style } from '../../utils/stylesheets/general_style';
import { color_scheme } from '../../utils/constants/app_constants';


interface TextInputProps {
    placeHolder: string,
    value: string,
    onChange: (text: string) => void;
    obscureText: boolean,
    type:  'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';
}

export default function CircularInputField(props: Partial<TextInputProps>) {
    return (
        <View style={[input_style.input_container, { borderRadius: 100, padding: 5, minHeight: 50 }]}>
            <TextInput
                style={[global_style.text, { width: "100%" }]}
                placeholder={props.placeHolder ?? "Type something..."}
                placeholderTextColor={color_scheme.placeholder_color}
                value={props.value}
                inputMode={props.type}
                secureTextEntry={props.obscureText}
                onChangeText={props.onChange} />
        </View>
    )
}
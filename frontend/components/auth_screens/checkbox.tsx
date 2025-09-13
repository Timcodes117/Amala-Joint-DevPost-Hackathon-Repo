import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { global_style } from '../../utils/stylesheets/general_style'
import { input_style } from '../../utils/stylesheets/input_style'
import { color_scheme } from '../../utils/constants/app_constants'
import { CheckIcon } from 'lucide-react-native'


interface checkboxProps{
    isChecked?: boolean;
    onChange?: ()=> void;
}

const Checkbox = (props:checkboxProps) => {
    return (
        <TouchableOpacity onPress={props.onChange} style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 }}>
            <View style={[input_style.input_container, global_style.centered, { width: 14, height: 14, borderColor: color_scheme.dark_outline, borderRadius: 4 }]}>
                {props.isChecked && <CheckIcon size={12} color={color_scheme.button_color} />}
            </View>
            <Text style={[global_style.text, { fontSize: 12 }]}>By checking this you agree to our terms and conditions.</Text>
        </TouchableOpacity>
    )
}

export default Checkbox
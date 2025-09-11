import { StyleSheet } from "react-native";
import { color_scheme } from "../constants/app_constants";

export const input_style = StyleSheet.create({
    input_container: {
        width: "100%",
        height: 44,
        borderColor: color_scheme.outline,
        borderWidth: 0.8,
    },
    input_container_fill: {
        width: "100%",
        height: 44,
        backgroundColor: color_scheme.dark
    },

    input_text: {
        fontSize: 14,
        color: color_scheme.text_color
    },

    input_placeholder: {
        fontSize: 16,
        color: color_scheme.placeholder_color
    }
})
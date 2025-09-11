import { StyleSheet } from "react-native";
import { color_scheme, font_name } from "../constants/app_constants";

export const global_style = StyleSheet.create({
    text: {
        fontFamily: font_name,
        color: color_scheme.text_color,
        fontSize: 14,
    },
    centered: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    ver_line: {
        // width: "auto",
        flex: 50,
        height: 1,
        backgroundColor: color_scheme.grey_bg
    }
})
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
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#1e90ff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
})
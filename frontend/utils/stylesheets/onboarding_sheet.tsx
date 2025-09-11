import { StyleSheet } from "react-native";
import { color_scheme, font_name, font_name_bold } from "../constants/app_constants";

export const onboarding_sheet = StyleSheet.create({
    title: {
        fontFamily: font_name_bold,
        color: color_scheme.text_color,
        fontSize: 20,
        fontWeight: "medium",
        maxWidth: 310,
        textAlign: "center"
    },
    subtitle: {
        fontFamily: font_name,
        color: color_scheme.link_color,
        fontSize: 12,
        maxWidth: 310,
        textAlign: "center"
    },
    centered: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    conatiner: {
        width: "100%",
        minHeight: 340,
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        backgroundColor: color_scheme.light,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20
    }
})
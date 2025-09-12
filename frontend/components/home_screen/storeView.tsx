import { View, Text, Image } from 'react-native'
import React from 'react'
import { global_style } from '../../utils/stylesheets/general_style'
import { color_scheme, font_name_bold } from '../../utils/constants/app_constants'
import { MapPin, Star } from 'lucide-react-native'
import { MaterialIcons } from '@expo/vector-icons';

const StoreView = () => {
    return (
        <View style={{ flexDirection: "column", gap: 5 }}>
            <Image source={require("../../assets/images/ama2.jpg")}
                style={{ width: "100%", height: 172, borderRadius: 8 }}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Mama Kemi's Kitchen</Text>
                <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 14 }]}>₦800 - ₦1,500</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                    <MapPin size={16} />
                    <Text style={[global_style.text, { fontSize: 14 }]}>15 Allen Avenue, Ikeja</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                    <Star size={16} color={color_scheme.placeholder_color} />
                    <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color }]}>4.9</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                 <MaterialIcons name="directions-walk" size={16} color="black" />
                <Text style={[global_style.text, { fontSize: 14 }]}>15 mins away</Text>
            </View>
        </View>
    )
}

export default StoreView
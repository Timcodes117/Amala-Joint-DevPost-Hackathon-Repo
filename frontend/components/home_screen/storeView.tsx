import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { global_style } from '../../utils/stylesheets/general_style'
import { color_scheme, font_name_bold } from '../../utils/constants/app_constants'
import { MapPin, Star } from 'lucide-react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router'
import { PlaceResult, PlacesApiResponse } from '../../utils/types/places_api_types'

const StoreView = ({ item_data }: { item_data: PlaceResult }) => {
    return (
        <TouchableOpacity style={{ flexDirection: "column", gap: 5 }} onPress={() => router.push({ pathname: '/home_screen/details', params: { data: JSON.stringify(item_data) } })}>
            <Image source={{
                uri: item_data.photos
                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item_data.photos[0].photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
                    : "https://via.placeholder.com/150"
            }}
                style={{ width: "100%", height: 172, borderRadius: 8 }}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Mama Kemi's Kitchen</Text>
                <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 14 }]}>₦800 - ₦1,500</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                    <MapPin size={16} />
                    <Text style={[global_style.text, { fontSize: 14 }]}>{item_data.vicinity}</Text>
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
        </TouchableOpacity>
    )
}

export default StoreView
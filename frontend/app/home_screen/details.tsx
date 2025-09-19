import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import { color_scheme, font_name_bold } from '../../utils/constants/app_constants'
import { global_style } from '../../utils/stylesheets/general_style'
import BackButton from '../../components/buttons/back_button'
import { router, useLocalSearchParams } from 'expo-router'
import { PlaceResult } from '../../utils/types/places_api_types'
import { MapPin, Star, Heart } from 'lucide-react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { useSavedPosts } from '../../contexts/savedPosts'

const Details = () => {
  const { width, height } = Dimensions.get('window')
  const { data } = useLocalSearchParams();
  const itemData: PlaceResult = data ? JSON.parse(data as string) : null;
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  
  const isSaved = itemData ? isPostSaved(itemData.place_id) : false;

  const handleSavePost = async () => {
    if (!itemData) return;
    
    if (isSaved) {
      await unsavePost(itemData.place_id);
    } else {
      await savePost(itemData);
    }
  };
  return (
    <SafeAreaView>
      <View style={{ padding: 24, position: 'absolute', top: 30, left: 0, right: 0, zIndex: 1000 }}>
        <BackButton onTap={() => router.back()} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: color_scheme.light,
          // paddingTop: Constants.statusBarHeight,
          // paddingHorizontal: 24,
        }}
      >
        <Image source={{
          uri: itemData.photos
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${itemData.photos[0].photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
            : "https://via.placeholder.com/150"
        }}
          style={{ width: '100%', height: (height / 2), resizeMode: 'cover' }} />

        <View style={{ padding: 24, marginTop: -50, backgroundColor: color_scheme.light, borderTopLeftRadius: 16, borderTopRightRadius: 16, minHeight: height }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Image source={{
                uri: itemData.photos
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${itemData.photos[0].photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
                  : "https://via.placeholder.com/150"
              }} style={{ height: 40, width: 40, borderRadius: 100 }} />
              <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                <Text style={[global_style.text, { fontFamily: font_name_bold }]}>{itemData.name}</Text>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                  <Star size={10} color={color_scheme.placeholder_color} />
                  <Text style={[global_style.text, { fontSize: 10, color: color_scheme.placeholder_color }]}>{itemData?.rating ?? 0} ({itemData?.user_ratings_total ?? 0})</Text>
                </View>
              </View>
            </View>
              <Text style={[global_style.text]}>₦700 - ₦1,800</Text>
          </View>

        <View style={[{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  }, {marginTop: 20}]}>
            {itemData.photos?.slice(0, 4).map((photo: any, index: number) => (
              <Image key={index} source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528` }} style={{
                width: 60,
                height: 60,
                borderRadius: 8,
              }} />
            ))}
          </View>
            <Text style={[global_style.text, {fontFamily: font_name_bold}]}>Description</Text>
            <Text style={[global_style.text]}>A great amala spot isn’t just a place to eat it’s an experience. The air greets you with the rich aroma of freshly made stews like ewedu, gbegiri, and spicy ata. The amala itself is ...more</Text>

            <Text style={[global_style.text, {fontFamily: font_name_bold, marginTop: 10}]}>Opening Hours</Text>
            
            {itemData?.opening_hours?.weekday_text ? (
              <View style={{ marginTop: 10 }}>
                {itemData.opening_hours.weekday_text.map((dayHours, index) => (
                  <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={[global_style.text, { fontSize: 14 }]}>
                      {dayHours.split(':')[0]}:
                    </Text>
                    <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color }]}>
                      {dayHours.split(':').slice(1).join(':').trim()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color }]}>
                  Opening hours not available
                </Text>
              </View>
            )}

            <View style={{ overflow: "hidden", borderRadius: 12, marginTop: 20 }}>
            <MapView
              style={{ width: "100%", height: 166, borderRadius: 12 }}
              provider={PROVIDER_GOOGLE}
              onPress={() => router.push("/home_screen/explore")}
              region={{
                latitude: itemData?.geometry?.location?.lat ?? 6.5244,
                longitude: itemData?.geometry?.location?.lng ?? 3.3792,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              initialRegion={{
                latitude: itemData?.geometry?.location?.lat ?? 6.5244,
                longitude: itemData?.geometry?.location?.lng ?? 3.3792,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              <Marker
                coordinate={{
                  latitude: itemData?.geometry?.location?.lat ?? 6.5244,
                  longitude: itemData?.geometry?.location?.lng ?? 3.3792,
                }}
                title={itemData?.name}
                description={itemData?.vicinity}
              />
            </MapView>
          </View>
          <View style={{flexDirection: "row", alignItems: "center", marginTop: 10, gap: 5}}>
            <MapPin size={18} />
          <Text style={[global_style.text, {fontFamily: font_name_bold}]}>{itemData.vicinity}</Text>
          </View>
           <Text style={[global_style.text, {fontFamily: font_name_bold, marginTop: 25}]}>Catalogue</Text>
           
           <View style={{ marginTop: 15 }}>
             {/* Sample menu items - you can replace this with actual data */}
             {/* <View style={{ flexDirection: 'row', marginBottom: 15, backgroundColor: color_scheme.light, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
               <Image 
                 source={{ uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop" }}
                 style={{ width: 60, height: 60, borderRadius: 8 }}
               />
               <View style={{ flex: 1, marginLeft: 12, justifyContent: 'space-between' }}>
                 <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Amala with Ewedu</Text>
                 <Text style={[global_style.text, { fontSize: 12, color: color_scheme.placeholder_color, marginTop: 4 }]}>Traditional Nigerian dish with fresh vegetables</Text>
                 <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 14, color: color_scheme.link_color, marginTop: 4 }]}>₦800</Text>
               </View>
             </View> */}

             <View style={{ flexDirection: 'row', marginBottom: 15, backgroundColor: color_scheme.light, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
               <Image 
                 source={{ uri: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop" }}
                 style={{ width: 60, height: 60, borderRadius: 8 }}
               />
               <View style={{ flex: 1, marginLeft: 12, justifyContent: 'space-between' }}>
                 <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Pounded Yam with Egusi</Text>
                 <Text style={[global_style.text, { fontSize: 12, color: color_scheme.placeholder_color, marginTop: 4 }]}>Rich melon seed soup with pounded yam</Text>
                 <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 14, color: color_scheme.link_color, marginTop: 4 }]}>₦1,200</Text>
               </View>
             </View>

             <View style={{ flexDirection: 'row', marginBottom: 15, backgroundColor: color_scheme.light, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
               <Image 
                 source={{ uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop" }}
                 style={{ width: 60, height: 60, borderRadius: 8 }}
               />
               <View style={{ flex: 1, marginLeft: 12, justifyContent: 'space-between' }}>
                 <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Jollof Rice</Text>
                 <Text style={[global_style.text, { fontSize: 12, color: color_scheme.placeholder_color, marginTop: 4 }]}>Spiced tomato rice with chicken</Text>
                 <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 14, color: color_scheme.link_color, marginTop: 4 }]}>₦1,500</Text>
               </View>
             </View>
           </View>

           <TouchableOpacity 
            style={{
              backgroundColor: isSaved ? color_scheme.success_color : '#FF4444',
              borderRadius: 100,
              paddingVertical: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
            onPress={handleSavePost}
          >
            <Heart 
              size={16} 
              color="white" 
              fill={isSaved ? "white" : "transparent"}
            />
            <Text style={{
                color: 'white',
                fontSize: 16,
               fontFamily: font_name_bold,
             }}>{isSaved ? 'Saved' : 'Save Post'}</Text>
          </TouchableOpacity>

            </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Details
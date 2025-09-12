import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Constants from 'expo-constants'
import { global_style } from '../../utils/stylesheets/general_style'
import { color_scheme, font_name, font_name_bold } from '../../utils/constants/app_constants'
import { input_style } from '../../utils/stylesheets/input_style'
import { ChevronDown, FilterIcon, Locate, MapPin, MapPinned, Plus, Search, User } from 'lucide-react-native'
import RoundButton from '../../components/buttons/rounded_button'
import WideButton from '../../components/auth_screens/wideButton'
import MapView, { Marker } from 'react-native-maps'
import StoreView from '../../components/home_screen/storeView'
import { useAppContext } from '../../contexts/app'
// import MapViewClustering from "react-native-map-clustering";
// import { Map } from 'react-native-maps'

const HomeScreen = () => {
  const markers = [
    { id: 1, lat: 37.78825, lng: -122.4324 },
    { id: 2, lat: 37.78925, lng: -122.4224 },
    // ... hundreds more
  ];

  const { getPlacesNearby, userLocation } = useAppContext();

  React.useEffect(() => {
    getPlacesNearby(userLocation?.coords.longitude ?? 0, userLocation?.coords.latitude ?? 0)
  }, [])

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: Constants.statusBarHeight,
        padding: 24,
        justifyContent: "flex-start",
        backgroundColor: color_scheme.light
        // alignItems: "center",
      }}>
      <View style={{
        display: "flex", flexDirection: "row", paddingTop: 20, alignItems: "center", gap: 20,
        justifyContent: "space-between"
      }}>

        <View style={[input_style.input_container, global_style.centered, { height: 32, maxWidth: "75%", borderRadius: 50, flex: 1, flexGrow: 1, flexDirection: "row", gap: 10, justifyContent: "space-evenly" }]}>
          <MapPinned size={14} color={color_scheme.link_color} />
          <Text style={[global_style.text, { fontSize: 14, color: color_scheme.link_color }]}>Jaja, University of Lagos...</Text>
          <ChevronDown size={14} color={color_scheme.link_color} />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <RoundButton>
            <Plus size={20} color={color_scheme.dark_outline} />
          </RoundButton>

          <RoundButton>
            <User size={20} color={color_scheme.dark_outline} />
          </RoundButton>
        </View>
      </View>

      <View style={{ flexDirection: "column", marginTop: 10, marginBottom: 10 }}>
        <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 20 }]}>Hello Tim,</Text>
        <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 18 }]}>There are 3 stores near you!</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={[{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", height: 48, backgroundColor: color_scheme.borderless, padding: 10, borderRadius: 100 }]}>
          <Search size={24} color={color_scheme.placeholder_color} />
          <Text style={[global_style.text, { color: color_scheme.placeholder_color }]}>Search for stores and dishes near you</Text>
        </TouchableOpacity>
        <RoundButton overrideStyle={{ borderWidth: 0, backgroundColor: color_scheme.borderless, padding: 10, height: 48, width: 48 }}>
          <FilterIcon size={20} color={color_scheme.placeholder_color} />
        </RoundButton>
      </View>

      <View style={{ flexDirection: "column", marginTop: 10, marginBottom: 10 }}>
        <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Explore Map</Text>
        <Text style={[global_style.text, { fontFamily: font_name, fontSize: 12, marginBottom: 10, color: color_scheme.link_color }]}>Tap on map to expand and see more..</Text>
        <View style={{ overflow: "hidden", borderRadius: 12 }}>
          <MapView
            style={{ width: "100%", height: 166, borderRadius: 12 }}
            region={{
              latitude: userLocation?.coords.latitude ?? 0,
              longitude: userLocation?.coords.longitude ?? 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* {markers.map((m) => (
              <Marker
                key={m.id}
                coordinate={{ latitude: m.lat, longitude: m.lng }}
                title={`Marker ${m.id}`}
              />
            ))} */}
          </MapView>
        </View>
      </View>

      <View style={{ flexDirection: "column", marginTop: 10,}}>
        <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Stores near you</Text>
        <Text style={[global_style.text, { fontFamily: font_name, fontSize: 14, marginBottom: 10, color: color_scheme.link_color }]}>here are list of stores near you..</Text>
      </View>

      <View style={{ flexDirection: "column", marginTop: 10, marginBottom: 10, gap: 30 }}>
        {/* <FlatList 
        data={[]}
        keyExtractor={(data)=> data.id}
        renderItem={()=> <StoreView />}
        
        /> */}

        <StoreView />
        <StoreView />
      </View>
    </ScrollView>
  )
}

export default HomeScreen
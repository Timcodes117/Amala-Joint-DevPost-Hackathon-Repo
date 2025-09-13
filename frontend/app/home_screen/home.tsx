import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import Constants from 'expo-constants'
import { global_style } from '../../utils/stylesheets/general_style'
import { color_scheme, font_name, font_name_bold } from '../../utils/constants/app_constants'
import { input_style } from '../../utils/stylesheets/input_style'
import { ChevronDown, FilterIcon, Grid3X3, Locate, MapPin, MapPinned, Plus, Search, User, Settings, Sparkles, StoreIcon, Bell } from 'lucide-react-native'
import RoundButton from '../../components/buttons/rounded_button'
import WideButton from '../../components/auth_screens/wideButton'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import StoreView from '../../components/home_screen/storeView'
import SpeedDialFAB from '../../components/home_screen/FAB'
import FilterModal, { FilterModalRef } from '../../components/home_screen/FilterModal'
import { useAppContext } from '../../contexts/app'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
// import { MotiView } from 'moti';

// import MapViewClustering from "react-native-map-clustering";
// import { Map } from 'react-native-maps'

const HomeScreen = () => {
  const filterModalRef = React.useRef<FilterModalRef>(null);
  
  const markers = [
    { id: 1, lat: 6.5244, lng: 3.3792, title: "Lagos Central" },
    { id: 2, lat: 6.5344, lng: 3.3892, title: "Victoria Island" },
    { id: 3, lat: 6.5144, lng: 3.3692, title: "Ikeja" },
    // ... more markers
  ];

  const { getCurrentLocation, getPlacesNearby, userLocation, getAddressFromCoords, UserAddress, googlePlacesApi } = useAppContext();

  // Speed dial actions
  const speedDialActions = [
    {
      id: 'chat',
      icon: (
        <Image
          source={require('../../assets/images/bot.png')}
          style={{ width: 50, height: 50, borderRadius: 100 }}
          resizeMode="contain"
        />
      ),
      onPress: () => router.push('/home_screen/chat'),
      label: 'Chat with Bot',
    },
    // {
    //   id: 'settings',
    //   icon: <Settings size={20} color={color_scheme.light} strokeWidth={2} />,
    //   onPress: () => console.log('Settings pressed'),
    //   label: 'Settings',
    // },
    {
      id: 'new_store',
      icon: <StoreIcon size={20} color={color_scheme.light} strokeWidth={2} />,
      onPress: () => router.push('/home_screen/new_post'),
      label: 'Add New Store',
    },
  ];

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    // Here you would implement your filtering logic
    // For example, filter the googlePlacesApi results based on the selected filters
  };

  React.useEffect(() => {
    const initializeLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        await Promise.all([
          getPlacesNearby(loc?.coords.longitude ?? 3.3792, loc?.coords.latitude ?? 6.5244),
          getAddressFromCoords(loc?.coords.latitude ?? 3.3792, loc?.coords.longitude ?? 6.5244)
        ]);
        // Wait a bit for location to be set, then get places
        setTimeout(() => {
        }, 1000);
      } catch (error) {
        console.log('Location error:', error);
        // Fallback to Lagos coordinates
        getPlacesNearby(3.3792, 6.5244);
      }
    };

    initializeLocation();
  }, [])


  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 10,
          paddingHorizontal: 24,
          justifyContent: "flex-start",
          backgroundColor: color_scheme.light
          // alignItems: "center",
        }}>
        <View style={{
          display: "flex", flexDirection: "row", paddingTop: 5, alignItems: "center", gap: 20,
          justifyContent: "space-between", width: "100%"
        }}>

          <View style={[input_style.input_container, global_style.centered, { height: 32, borderRadius: 50, flex: 1, flexDirection: "row", gap: 10, justifyContent: "space-evenly", paddingHorizontal: 10 }]}>
            <MapPinned size={14} color={color_scheme.link_color} />
            <Text style={[global_style.text, { fontSize: 12, color: color_scheme.link_color, maxWidth: "70%" }]} numberOfLines={1}>{UserAddress?.results[0].formatted_address}</Text>
            <ChevronDown size={14} color={color_scheme.link_color} />
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <RoundButton onTap={() => router.push('/home_screen/notification')}>
              <Bell size={20} color={color_scheme.dark_outline} />
            </RoundButton>

            <RoundButton onTap={() => router.push('/home_screen/profile')}>
              <User size={20} color={color_scheme.dark_outline} />
            </RoundButton>
          </View>
        </View>

        <View style={{ flexDirection: "column", marginTop: 10, marginBottom: 10 }}>
          <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 20 }]}>Hello Tim,</Text>
          <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 18 }]}>There are 3 stores near you!</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10, width: "100%", }}>
          <TouchableOpacity onPress={() => router.push("/home_screen/search")}
            style={[{ flexDirection: "row", gap: 10, flexGrow: 1, alignItems: "center", height: 48, backgroundColor: color_scheme.borderless, padding: 10, borderRadius: 100 }]}>
            <Search size={20} color={color_scheme.placeholder_color} />
            <Text style={[global_style.text, { color: color_scheme.placeholder_color, flexWrap: "wrap", width: "70%" }]} numberOfLines={1}>Search for stores and dishes near you</Text>
          </TouchableOpacity>
          <RoundButton onTap={() => filterModalRef.current?.present()} overrideStyle={{ borderWidth: 0, backgroundColor: color_scheme.borderless, padding: 10, height: 48, minWidth: 48 }}>
            <FilterIcon size={20} color={color_scheme.placeholder_color} />
          </RoundButton>
        </View>

        <View style={{ flexDirection: "column", marginTop: 10, marginBottom: 10 }}>
          <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Explore Map</Text>
          <Text style={[global_style.text, { fontFamily: font_name, fontSize: 12, marginBottom: 10, color: color_scheme.link_color }]}>Tap on map to expand and see more..</Text>
          <View style={{ overflow: "hidden", borderRadius: 12 }}>
            <MapView
              style={{ width: "100%", height: 166, borderRadius: 12 }}
              provider={PROVIDER_GOOGLE}
              onPress={() => router.push("/home_screen/explore")}
              region={{
                latitude: userLocation?.coords.latitude ?? 6.5244,
                longitude: userLocation?.coords.longitude ?? 3.3792,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              initialRegion={{
                latitude: userLocation?.coords.latitude ?? 6.5244,
                longitude: userLocation?.coords.longitude ?? 3.3792,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              {markers.map((m) => (
                <Marker
                  key={m.id}
                  coordinate={{ latitude: m.lat, longitude: m.lng }}
                  title={m.title}
                />
              ))}
            </MapView>
          </View>
        </View>

        <View style={{ flexDirection: "column", marginTop: 10, }}>
          <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 16 }]}>Stores near you</Text>
          <Text style={[global_style.text, { fontFamily: font_name, fontSize: 14, marginBottom: 10, color: color_scheme.link_color }]}>here are list of stores near you..</Text>
        </View>

        <View style={{ flexDirection: "column", marginTop: 10, marginBottom: 10, gap: 30 }}>
          {/* <FlatList
            data={googlePlacesApi?.results}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (<StoreView item_data={item} />)}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />} 
          /> */}

          {
            googlePlacesApi?.results
            .map((item) => (<StoreView item_data={item} key={item.place_id} />))
          }
        </View>
      </ScrollView>

      {/* Speed Dial Floating Action Button */}
      <SpeedDialFAB
        actions={speedDialActions}
        mainIcon={<Plus size={24} color={color_scheme.light} strokeWidth={2.5} />}
        size="medium"
        mainColor={color_scheme.button_color}
        secondaryColor={color_scheme.dark}
      />

      {/* Filter Modal */}
      <FilterModal
        ref={filterModalRef}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  )
}

export default HomeScreen

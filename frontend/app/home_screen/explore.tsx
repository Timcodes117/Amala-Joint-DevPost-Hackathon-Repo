import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import BackButton from '../../components/buttons/back_button'
import RoundButton from '../../components/buttons/rounded_button'
import FilterBottomSheet, { FilterBottomSheetRef } from '../../components/home_screen/FilterBottomSheet'
import { router } from 'expo-router'
import { useAppContext } from '../../contexts/app'
import { MapPin, Clock, Star, FilterIcon, Search, Locate } from 'lucide-react-native'
import { color_scheme, font_name, font_name_bold } from '../../utils/constants/app_constants'
import { global_style } from '../../utils/stylesheets/general_style'

const Explore = () => {
  const { userLocation, googlePlacesApi, getCurrentLocation } = useAppContext()
  const filterBottomSheetRef = React.useRef<FilterBottomSheetRef>(null);
  const { width } = Dimensions.get('window')
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [mapRegion, setMapRegion] = React.useState({
    latitude: userLocation?.coords.latitude ?? 6.5244,
    longitude: userLocation?.coords.longitude ?? 3.3792,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const flatListRef = React.useRef<FlatList>(null)
  const mapRef = React.useRef<MapView>(null)

  const handleBackPress = () => {
    router.back()
  }

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    // Here you would implement your filtering logic for explore results
  };

  // Update map region when carousel index changes with smooth animation
  React.useEffect(() => {
    if (googlePlacesApi?.results && googlePlacesApi.results.length > 0) {
      const currentPlace = googlePlacesApi.results[currentIndex]
      if (currentPlace?.geometry?.location) {
        const newRegion = {
          latitude: currentPlace.geometry.location.lat,
          longitude: currentPlace.geometry.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
        setMapRegion(newRegion)
        
        // Animate to the new region smoothly
        mapRef.current?.animateToRegion(newRegion, 1000)
      }
    }
  }, [currentIndex, googlePlacesApi])

  // Handle scroll events to track current index with throttling
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffsetX / width)
    
    // Only update if the index actually changed to prevent unnecessary re-renders
    if (index !== currentIndex) {
      setCurrentIndex(index)
    }
  }


  const restaurantData = [
    {
      id: 1,
      name: "Amala Earth",
      location: "Along DLI road, Red Bricks",
      hours: "8:30 am - 9:00 pm • Open",
      priceRange: "₦700 - ₦1,800",
      rating: "4.9",
      logo: "https://via.placeholder.com/60x60/8B7355/FFFFFF?text=AE",
      images: [
        "https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=1",
        "https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=2", 
        "https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=3",
        "https://via.placeholder.com/80x80/96CEB4/FFFFFF?text=4"
      ]
    },
    {
      id: 2,
      name: "Amala Palace",
      location: "Victoria Island, Lagos",
      hours: "7:00 am - 10:00 pm • Open",
      priceRange: "₦500 - ₦2,000",
      rating: "4.7",
      logo: "https://via.placeholder.com/60x60/8B7355/FFFFFF?text=AP",
      images: [
        "https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=1",
        "https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=2",
        "https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=3",
        "https://via.placeholder.com/80x80/96CEB4/FFFFFF?text=4"
      ]
    },
    {
      id: 3,
      name: "Amala Corner",
      location: "Ikeja, Lagos",
      hours: "6:30 am - 11:00 pm • Open",
      priceRange: "₦600 - ₦1,500",
      rating: "4.8",
      logo: "https://via.placeholder.com/60x60/8B7355/FFFFFF?text=AC",
      images: [
        "https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=1",
        "https://via.placeholder.com/80x80/4ECDC4/FFFFFF?text=2",
        "https://via.placeholder.com/80x80/45B7D1/FFFFFF?text=3",
        "https://via.placeholder.com/80x80/96CEB4/FFFFFF?text=4"
      ]
    }
  ]

  const RestaurantCard = ({ item }: { item: any }) => (
    <View style={styles.restaurantCard}>
      {/* Header Section */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Image source={{
                uri: item.photos
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
                  : "https://via.placeholder.com/150"
              }} style={{ height: 40, width: 40, borderRadius: 100 }} />
              <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                <Text style={[global_style.text, { fontFamily: font_name_bold }]}>{item.name}</Text>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                  <Star size={14} color={color_scheme.placeholder_color} />
                  <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color }]}>{item?.rating ?? 0} ({item?.user_ratings_total ?? 0})</Text>
                </View>
              </View>
            </View>
              <Text style={[global_style.text]}>{item.price_level}</Text>
          </View>

      {/* Images Section */}
      <View style={styles.imagesContainer}>
        {item.images.map((image: string, index: number) => (
          <Image key={index} source={{ uri: image }} style={styles.restaurantImage} />
        ))}
      </View>

      {/* Explore Button */}
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore Store</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}
        
        {/* Place markers from Google Places API */}
        {googlePlacesApi?.results?.map((place, index) => (
          <Marker
            key={place.place_id}
            coordinate={{
              latitude: place.geometry?.location?.lat ?? 0,
              longitude: place.geometry?.location?.lng ?? 0,
            }}
            title={place.name}
            description={place.vicinity}
            pinColor={index === currentIndex ? "red" : "green"}
            onPress={() => {
              setCurrentIndex(index)
              // Scroll to the selected item in the carousel with smooth animation
              flatListRef.current?.scrollToIndex({ index, animated: true })
            }}
          />
        ))}
      </MapView>
      
      {/* Floating Back Button */}
      <View style={styles.backButtonContainer}>
        <BackButton onTap={handleBackPress} />
        <View style={{ flexDirection: "row", gap: 10, flex: 1 }}>
          <TouchableOpacity onPress={() => router.push("/home_screen/search")}
            style={[{ flexDirection: "row", gap: 8, flex: 1, alignItems: "center", height: 48, backgroundColor: color_scheme.borderless, paddingHorizontal: 12, borderRadius: 100 }]}>
            <Search size={18} color={color_scheme.placeholder_color} />
            <Text style={[global_style.text, { color: color_scheme.placeholder_color, fontSize: 14 }]} numberOfLines={1}>Search</Text>
          </TouchableOpacity>
          <RoundButton 
            onTap={() => getCurrentLocation()} 
            overrideStyle={{ borderWidth: 0, backgroundColor: color_scheme.borderless, padding: 12, height: 48, width: 48 }}
          >
            <Locate size={18} color={color_scheme.placeholder_color} />
          </RoundButton>
        </View>
      </View>
      
      {/* Floating Bottom View */}
      <View style={styles.bottomFloatingView}>
        <FlatList
          ref={flatListRef}
          data={googlePlacesApi?.results}
          renderItem={({ item }) => <View style={styles.restaurantCard}>
          {/* Header Section */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Image source={{
                    uri: item.photos
                      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
                      : "https://via.placeholder.com/150"
                  }} style={{ height: 40, width: 40, borderRadius: 100 }} />
                  <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                    <Text style={[global_style.text, { fontFamily: font_name_bold }]}>{item.name}</Text>
                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                      <Star size={14} color={color_scheme.placeholder_color} />
                      <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color }]}>{item?.rating ?? 0} ({item?.user_ratings_total ?? 0})</Text>
                    </View>
                  </View>
                </View>
                  <Text style={[global_style.text]}>{item.price_level}</Text>
              </View>
    
          {/* Images Section */}
          <View style={[styles.imagesContainer, {marginTop: 20}]}>
            {item.photos?.slice(0, 4).map((photo: any, index: number) => (
              <Image key={index} source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528` }} style={styles.restaurantImage} />
            ))}
          </View>
    
          {/* Explore Button */}
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push({
              pathname: "/home_screen/details",
              params: { data: JSON.stringify(item) }
            })}
          >
            <Text style={styles.exploreButtonText}>Explore Store</Text>
          </TouchableOpacity>
        </View>}
          keyExtractor={(item) => item.place_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          snapToInterval={width}
          decelerationRate="fast"
          snapToAlignment="start"
          pagingEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>

      {/* Filter Modal */}
      <FilterBottomSheet
        ref={filterBottomSheetRef}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bottomFloatingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    // height: 300,
    // backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    zIndex: 1000,
    
  },
  carouselContainer: {
    paddingHorizontal: 0,
  },
  restaurantCard: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B7355',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: font_name_bold,
    color: color_scheme.text_color,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: color_scheme.text_color,
    marginLeft: 4,
    fontFamily: font_name,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 12,
    color: color_scheme.text_color,
    marginLeft: 4,
    fontFamily: font_name,
  },
  priceRatingContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 12,
    fontFamily: font_name_bold,
    color: color_scheme.text_color,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: font_name_bold,
    color: color_scheme.text_color,
    marginLeft: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  exploreButton: {
    backgroundColor: '#FF4444',
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: font_name_bold,
  },
})

export default Explore
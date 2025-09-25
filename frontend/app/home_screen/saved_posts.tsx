import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { global_style } from '../../utils/stylesheets/general_style'
import { color_scheme, font_name, font_name_bold } from '../../utils/constants/app_constants'
import BackButton from '../../components/buttons/back_button'
import { MapPin, Star, Minus, Heart } from 'lucide-react-native'
import { router } from 'expo-router'
import { useSavedPosts } from '../../contexts/savedPosts'
import { PlaceResult } from '../../utils/types/places_api_types'

const SavedPosts = () => {
  const { savedPosts, unsavePost } = useSavedPosts()

  const handleBackPress = () => {
    router.back()
  }

  const handleRemoveSpot = async (placeId: string) => {
    await unsavePost(placeId);
  }

  const handleSpotPress = (place: PlaceResult) => {
    router.push({
      pathname: '/home_screen/details',
      params: { data: JSON.stringify(place) }
    });
  }

  const renderSavedPost = ({ item }: { item: PlaceResult }) => (
    <TouchableOpacity 
      style={{
        flexDirection: 'row',
        backgroundColor: color_scheme.light,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: color_scheme.outline,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => handleSpotPress(item)}
    >
      <Image
        source={{ 
          uri: item.photos 
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
            : 'https://via.placeholder.com/100x100/FFD700/FFFFFF?text=Restaurant'
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 12,
          marginRight: 16
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[global_style.text, { fontSize: 18, fontFamily: font_name_bold, marginBottom: 6 }]}>
          {item.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <MapPin size={16} color={color_scheme.placeholder_color} />
          <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color, marginLeft: 6, flex: 1 }]} numberOfLines={1}>
            {item.vicinity || 'Location not available'}
          </Text>
        </View>
        {item.rating && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Star size={14} color={color_scheme.placeholder_color} />
            <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color, marginLeft: 4 }]}>
              {item.rating} ({item.user_ratings_total || 0} reviews)
            </Text>
          </View>
        )}
        {item.opening_hours && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              backgroundColor: item.opening_hours.open_now ? color_scheme.success_color : color_scheme.error_color,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
            }}>
              <Text style={[global_style.text, { fontSize: 12, color: color_scheme.light }]}>
                {item.opening_hours.open_now ? 'Open now' : 'Closed'}
              </Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color_scheme.grey_bg,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 12
        }}
        onPress={() => handleRemoveSpot(item.place_id)}
      >
        <Minus size={20} color={color_scheme.text_color} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color_scheme.light }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: color_scheme.light,
        borderBottomWidth: 1,
        borderBottomColor: color_scheme.outline,
      }}>
        <BackButton onTap={handleBackPress} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[global_style.text, { fontSize: 20, fontFamily: font_name_bold }]}>
            Saved Posts
          </Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {savedPosts.length > 0 ? (
          <>
            <View style={{ marginBottom: 16 }}>
              <Text style={[global_style.text, { fontSize: 16, color: color_scheme.placeholder_color }]}>
                {savedPosts.length} saved {savedPosts.length === 1 ? 'restaurant' : 'restaurants'}
              </Text>
            </View>
            <FlatList
              data={savedPosts}
              keyExtractor={(item) => item.place_id}
              renderItem={renderSavedPost}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </>
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingHorizontal: 40 
          }}>
            <Heart 
              size={80} 
              color={color_scheme.placeholder_color} 
              style={{ marginBottom: 24 }}
            />
            <Text style={[global_style.text, { fontSize: 24, fontFamily: font_name_bold, textAlign: 'center', marginBottom: 12 }]}>
              No Saved Posts Yet
            </Text>
            <Text style={[global_style.text, { fontSize: 16, color: color_scheme.placeholder_color, textAlign: 'center', lineHeight: 24 }]}>
              Start exploring restaurants and save your favorites to see them here
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: color_scheme.button_color,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 25,
                marginTop: 24,
              }}
              onPress={() => router.push('/home_screen/home')}
            >
              <Text style={[global_style.text, { fontSize: 16, fontFamily: font_name_bold, color: color_scheme.light }]}>
                Explore Restaurants
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default SavedPosts


import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { global_style } from '../../utils/stylesheets/general_style'
import { color_scheme, font_name, font_name_bold } from '../../utils/constants/app_constants'
import BackButton from '../../components/buttons/back_button'
import { Bell, ChevronRight, Edit3, Star, MapPin, Minus, Globe, Sun, LogOut } from 'lucide-react-native'
import { router } from 'expo-router'
import { useAuth } from '../../contexts/auth'

const Profile = () => {
  const [isLightMode, setIsLightMode] = useState(true)
  const { user, signOut } = useAuth()

  const handleBackPress = () => {
    router.back()
  }

  const handleNotificationPress = () => {
    // Handle notification settings
  }

  const handleLanguagePress = () => {
    // Handle language settings
  }

  const handleLogoutPress = () => {
    signOut()
  }

  const handleRemoveSpot = (spotId: string) => {
    // Handle removing saved spot
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color_scheme.light }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: color_scheme.light
      }}>
        <BackButton onTap={handleBackPress} />
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: color_scheme.light,
            borderWidth: 1,
            borderColor: color_scheme.outline,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
          onPress={handleNotificationPress}
        >
          <Bell size={24} color={color_scheme.text_color} />
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color_scheme.error_color
          }} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Information */}
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Image
            source={user?.picture ? { uri: user.picture } : require('../../assets/images/bot.png')}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginBottom: 16
            }}
          />
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[global_style.text, { fontSize: 24, fontFamily: font_name_bold, marginRight: 8 }]}>
              {user?.name || 'User'}
            </Text>
            <Edit3 size={16} color={color_scheme.text_color} />
          </View>
          
          <Text style={[global_style.text, { fontSize: 16, color: color_scheme.placeholder_color, marginBottom: 16 }]}>
            {user?.email || 'user@example.com'}
          </Text>
          
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              backgroundColor: color_scheme.error_color,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 8
            }}>
              <Star size={12} color={color_scheme.light} />
              <Text style={[global_style.text, { fontSize: 12, color: color_scheme.light, marginLeft: 4 }]}>
                Silver member
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[global_style.text, { fontSize: 16, color: color_scheme.error_color }]}>
                ?
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Saved Spots Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <Text style={[global_style.text, { fontSize: 20, fontWeight: 'bold' }]}>
              Saved spots
            </Text>
            <TouchableOpacity>
              <Text style={[global_style.text, { fontSize: 16, color: color_scheme.link_color }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {/* Saved Spot Cards */}
          {[1, 2].map((item) => (
            <View key={item} style={{
              flexDirection: 'row',
              backgroundColor: color_scheme.light,
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: color_scheme.outline,
              alignItems: 'center'
            }}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80x80/FFD700/FFFFFF?text=Restaurant' }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  marginRight: 12
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[global_style.text, { fontSize: 16, fontFamily: font_name_bold, marginBottom: 4 }]}>
                  Mama Kemi's Kitchen
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MapPin size={14} color={color_scheme.placeholder_color} />
                  <Text style={[global_style.text, { fontSize: 14, color: color_scheme.placeholder_color, marginLeft: 4 }]}>
                    15 Allen Avenue, Ikeja
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: color_scheme.grey_bg,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => handleRemoveSpot(item.toString())}
              >
                <Minus size={16} color={color_scheme.text_color} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Settings Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          {/* <Text style={[global_style.text, { fontSize: 20, fontFamily: font_name_bold, marginBottom: 16 }]}>
            Settings
          </Text> */}

          {/* Settings Items */}
          <View style={{
            backgroundColor: color_scheme.light,
          }}>
            {/* Notification */}
            {/* <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: color_scheme.outline,
                height: 56
              }}
              onPress={handleNotificationPress}
            >
              <Bell size={20} color={color_scheme.text_color} />
              <Text style={[global_style.text, { fontSize: 16, marginLeft: 12, flex: 1 }]}>
                Notification
              </Text>
              <ChevronRight size={20} color={color_scheme.placeholder_color} />
            </TouchableOpacity> */}

            {/* Language */}
            {/* <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: color_scheme.outline,
                height: 56
              }}
              onPress={handleLanguagePress}
            >
              <Globe size={20} color={color_scheme.text_color} />
              <Text style={[global_style.text, { fontSize: 16, marginLeft: 12, flex: 1 }]}>
                Language
              </Text>
              <ChevronRight size={20} color={color_scheme.placeholder_color} />
            </TouchableOpacity> */}

            {/* Light Mode */}
            {/* <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: color_scheme.outline,
              height: 56
            }}>
              <Sun size={20} color={color_scheme.text_color} />
              <Text style={[global_style.text, { fontSize: 16, marginLeft: 12, flex: 1 }]}>
                Light Mode
              </Text>
              <Switch
                value={isLightMode}
                onValueChange={setIsLightMode}
                trackColor={{ false: color_scheme.grey_bg, true: color_scheme.success_color }}
                thumbColor={color_scheme.light}
              />
            </View> */}

            {/* Log out */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                height: 56
              }}
              onPress={handleLogoutPress}
            >
              <LogOut size={20} color={color_scheme.error_color} />
              <Text style={[global_style.text, { fontSize: 16, color: color_scheme.error_color, marginLeft: 12, flex: 1 }]}>
                Log out
              </Text>
              <ChevronRight size={20} color={color_scheme.placeholder_color} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import Constants from 'expo-constants'
import { global_style } from '../../utils/stylesheets/general_style'
import { color_scheme, font_name_bold,} from '../../utils/constants/app_constants'
import { input_style } from '../../utils/stylesheets/input_style'
import { ChevronLeft, MapPin, Camera, Plus, Calendar, ChevronDown, AlertTriangle } from 'lucide-react-native'
import RoundButton from '../../components/buttons/rounded_button'
import WideButton from '../../components/auth_screens/wideButton'
import CircularInputField from '../../components/auth_screens/input_field'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const NewPost = () => {
  // Basic Information
  const [restaurantName, setRestaurantName] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [openingTime, setOpeningTime] = useState('')
  const [closingTime, setClosingTime] = useState('')
  
  // Cuisine Type
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([])
  
  // Food Catalogue
  const [foodType, setFoodType] = useState('')
  const [stewType, setStewType] = useState('')
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const [foodImage, setFoodImage] = useState<string | null>(null)
  
  // Store Details
  const [storeDescription, setStoreDescription] = useState('')
  const [storeImage, setStoreImage] = useState<string | null>(null)

  const cuisineTypes = [
    'Fast Nigerian', 'Modern Nigerian', 'Igbo Cuisine', 
    'Yoruba Cuisine', 'Hausa Cuisine', 'Continental'
  ]

  const handleImageUpload = (type: 'food' | 'store') => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' }
      ]
    )
  }

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisine(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    )
  }

  const handleSubmit = () => {
    if (!restaurantName || !location || !phoneNumber || !foodType || !stewType || !priceFrom || !priceTo) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }
    
    Alert.alert('Success', 'Amala spot submitted for review!', [
      { text: 'OK', onPress: () => router.back() }
    ])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color_scheme.light }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        paddingHorizontal: 24,
        paddingBottom: 10,
        width: '100%',
        position: 'relative'
      }}>
        <RoundButton onTap={() => router.back()}>
          <ChevronLeft size={20} color={color_scheme.dark_outline} />
        </RoundButton>
        
        <View style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          alignItems: 'center',
        paddingTop: Constants.statusBarHeight  ,

          height: 60,
          // zIndex: /-1
        }}>
          <Text style={[global_style.text, { fontSize: 16 }]}>
            Add New Amala Spot
          </Text>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 30
        }}
      >
        {/* Basic Information Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 18, marginBottom: 20 }]}>
            Basic Information
          </Text>
          
          {/* Restaurant Name */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Restaurant Name *
            </Text>
            <CircularInputField
              placeHolder="e.g. Iya Moria foods."
              value={restaurantName}
              onChange={setRestaurantName}
              type="text"
              obscureText={false}
            />
          </View>

          {/* Location */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Location *
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <CircularInputField
                placeHolder="Enter Location"
                value={location}
                onChange={setLocation}
                type="text"
                obscureText={false}
              />
              {/* <RoundButton overrideStyle={{ backgroundColor: color_scheme.grey_bg }}>
                <MapPin size={20} color={color_scheme.placeholder_color} />
              </RoundButton> */}
            </View>
          </View>

          {/* Phone Number */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Phone Number *
            </Text>
            <CircularInputField
              placeHolder="e.g. +234 8110453053"
              value={phoneNumber}
              onChange={setPhoneNumber}
              type="tel"
              obscureText={false}
            />
          </View>

          {/* Operation Hours */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Operation Hours *
            </Text>
            <View style={{ flexDirection: 'column', width: '70%', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[global_style.text, { fontSize: 14, marginBottom: 5, color: color_scheme.placeholder_color }]}>
                  Opening time
                </Text>
                <View style={[input_style.input_container, { borderRadius: 100, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                  <Calendar size={16} color={color_scheme.placeholder_color} />
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 16 }]}
                    placeholder="e.g. 8:00 AM"
                    placeholderTextColor={color_scheme.placeholder_color}
                    value={openingTime}
                    onChangeText={setOpeningTime}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[global_style.text, { fontSize: 14, marginBottom: 5, color: color_scheme.placeholder_color }]}>
                  Closing time
                </Text>
                <View style={[input_style.input_container, { borderRadius: 100, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                  <Calendar size={16} color={color_scheme.placeholder_color} />
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 16 }]}
                    placeholder="e.g. 10:00 PM"
                    placeholderTextColor={color_scheme.placeholder_color}
                    value={closingTime}
                    onChangeText={setClosingTime}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Cuisine Type Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[global_style.text, {  fontSize: 18, marginBottom: 20 }]}>
            Cuisine type
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {cuisineTypes.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                style={[
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: selectedCuisine.includes(cuisine) ? color_scheme.button_color : color_scheme.outline,
                    backgroundColor: selectedCuisine.includes(cuisine) ? color_scheme.button_color : color_scheme.light,
                    marginBottom: 8
                  }
                ]}
                onPress={() => toggleCuisine(cuisine)}
              >
                <Text style={[
                  global_style.text, 
                  { 
                    fontSize: 14,
                    color: selectedCuisine.includes(cuisine) ? color_scheme.light : color_scheme.text_color
                  }
                ]}>
                  {cuisine}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Food Catalogue Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[global_style.text, {  fontSize: 18, marginBottom: 20 }]}>
            Food Catalogue
          </Text>
          
          {/* Food Type */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Food type *
            </Text>
            <CircularInputField
              placeHolder="e.g. 2 portions of Amala"
              value={foodType}
              onChange={setFoodType}
              type="text"
              obscureText={false}
            />
          </View>

          {/* Stew Type */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Stew Type *
            </Text>
            <CircularInputField
              placeHolder="e.g. Gbegiri"
              value={stewType}
              onChange={setStewType}
              type="text"
              obscureText={false}
            />
          </View>

          {/* Price Range */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Price Range *
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[global_style.text, { fontSize: 14, marginBottom: 5, color: color_scheme.placeholder_color }]}>
                  From
                </Text>
                <View style={[input_style.input_container, { borderRadius: 100, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                  <Text style={[global_style.text, { fontSize: 16, color: color_scheme.text_color }]}>N</Text>
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 16 }]}
                    placeholder="0"
                    placeholderTextColor={color_scheme.placeholder_color}
                    value={priceFrom}
                    onChangeText={setPriceFrom}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[global_style.text, { fontSize: 14, marginBottom: 5, color: color_scheme.placeholder_color }]}>
                  To
                </Text>
                <View style={[input_style.input_container, { borderRadius: 100, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                  <Text style={[global_style.text, { fontSize: 16, color: color_scheme.text_color }]}>N</Text>
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 16 }]}
                    placeholder="0"
                    placeholderTextColor={color_scheme.placeholder_color}
                    value={priceTo}
                    onChangeText={setPriceTo}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Upload Food Image */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Upload food image
            </Text>
            <TouchableOpacity
              style={[
                global_style.centered,
                {
                  width: '100%',
                  height: 150,
                  borderWidth: 2,
                  borderColor: color_scheme.outline,
                  borderStyle: 'dashed',
                  borderRadius: 12,
                  backgroundColor: color_scheme.borderless
                }
              ]}
              onPress={() => handleImageUpload('food')}
            >
              <View style={[global_style.centered, { gap: 10 }]}>
                <Camera size={40} color={color_scheme.placeholder_color} />
                <Text style={[global_style.text, { color: color_scheme.placeholder_color, textAlign: 'center' }]}>
                  Snap or upload image of food catalogue
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Add Another Catalogue Button */}
          <TouchableOpacity
            style={[
              global_style.centered,
              input_style.input_container_fill,
              { height: 48, borderRadius: 100, flexDirection: 'row', gap: 10 }
            ]}
            onPress={() => console.log('Add another catalogue')}
          >
            <Plus size={20} color={color_scheme.light} />
            <Text style={[global_style.text, { color: color_scheme.light, fontSize: 16 }]}>
              Add another catalogue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Store Details Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[global_style.text, {  fontSize: 18, marginBottom: 20 }]}>
            Store Details
          </Text>
          
          {/* Store Description */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Store Description *
            </Text>
            <CircularInputField
              placeHolder="Tell us what makes your spot special"
              value={storeDescription}
              onChange={setStoreDescription}
              type="text"
              obscureText={false}
            />
          </View>

          {/* Store Image */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 16, marginBottom: 10 }]}>
              Store Image
            </Text>
            <TouchableOpacity
              style={[
                global_style.centered,
                {
                  width: '100%',
                  height: 150,
                  borderWidth: 2,
                  borderColor: color_scheme.outline,
                  borderStyle: 'dashed',
                  borderRadius: 12,
                  backgroundColor: color_scheme.borderless
                }
              ]}
              onPress={() => handleImageUpload('store')}
            >
              <View style={[global_style.centered, { gap: 10 }]}>
                <Camera size={40} color={color_scheme.placeholder_color} />
                <Text style={[global_style.text, { color: color_scheme.placeholder_color, textAlign: 'center' }]}>
                  Snap or upload image of the store
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Review Process Section */}
        <View style={{ marginBottom: 30 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 }}>
            <AlertTriangle size={24} color="#FF6B35" />
            <Text style={[global_style.text, {  fontSize: 18, color: "#FF0000" }]}>
              Review Process
            </Text>
          </View>
          <Text style={[global_style.text, { fontSize: 14, color: "#FF0000", lineHeight: 20 }]}>
            Your submission will be reviewed by our team within 24-48 hours. We'll notify you once it's approved and live on the platform.
          </Text>
    </View>

        {/* Submit Button */}
        <WideButton
          type="fill"
          onTap={handleSubmit}
          fillColor={color_scheme.button_color}
        >
          Submit for Review
        </WideButton>
      </ScrollView>
    </SafeAreaView>
  )
}

export default NewPost
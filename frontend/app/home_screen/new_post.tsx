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
  // Tab state
  const [activeTab, setActiveTab] = useState<'add' | 'verify'>('add')
  
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
        
        {/* <View style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          alignItems: 'center',
          // paddingTop: Constants.statusBarHeight,
          height: 60,
        }}>
          <Text style={[global_style.text, { fontSize: 14 }]}>
            Store Screen
          </Text>
        </View> */}
      </View>

      {/* Tab Navigation */}
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 20,
        gap: 30,
        marginTop: 10
      }}>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          onPress={() => setActiveTab('add')}
        >
          <Text style={[global_style.text, { 
            fontSize: 14, 
            color: activeTab === 'add' ? color_scheme.text_color : color_scheme.placeholder_color,
            borderBottomWidth: activeTab === 'add' ? 2 : 0,
            borderBottomColor: activeTab === 'add' ? color_scheme.text_color : 'transparent',
            paddingBottom: 2
          }]}>
            Add Store
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          onPress={() => setActiveTab('verify')}
        >
          <Text style={[global_style.text, { 
            fontSize: 14, 
            color: activeTab === 'verify' ? color_scheme.text_color : color_scheme.placeholder_color,
            borderBottomWidth: activeTab === 'verify' ? 2 : 0,
            borderBottomColor: activeTab === 'verify' ? color_scheme.text_color : 'transparent',
            paddingBottom: 2
          }]}>
            Verify Stores
          </Text>
          <View style={{
            backgroundColor: '#FF0000',
            borderRadius: 10,
            paddingHorizontal: 6,
            paddingVertical: 2,
            minWidth: 20,
            alignItems: 'center'
          }}>
            <Text style={[global_style.text, { fontSize: 11, color: 'white' }]}>
              2
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 30
        }}
      >
        {activeTab === 'add' ? (
          <>
            {/* Basic Information Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[global_style.text, { fontFamily: font_name_bold, fontSize: 14, marginBottom: 20 }]}>
            Basic Information
          </Text>
          
          {/* Restaurant Name */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
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
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
              Location *
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <CircularInputField
                placeHolder="Enter Address"
                value={location}
                onChange={setLocation}
                type="text"
                obscureText={false}
              />
              <RoundButton overrideStyle={{ backgroundColor: color_scheme.grey_bg }}>
                <MapPin size={20} color={color_scheme.placeholder_color} />
              </RoundButton>
            </View>
          </View>

          {/* Phone Number */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
              Phone Number *
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
             
              <CircularInputField
                placeHolder="e.g. +234 8110453053"
                value={phoneNumber}
                onChange={setPhoneNumber}
                type="tel"
                obscureText={false}
              />
            </View>
          </View>

          {/* Operation Hours */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
              Operation Hours *
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <View style={[input_style.input_container, { borderRadius: 100, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                  <Calendar size={14} color={color_scheme.placeholder_color} />
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 14 }]}
                    placeholder="8:30 AM"
                    placeholderTextColor={color_scheme.placeholder_color}
                    value={openingTime}
                    onChangeText={setOpeningTime}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={[input_style.input_container, { borderRadius: 100, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                  <Calendar size={14} color={color_scheme.placeholder_color} />
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 14 }]}
                    placeholder="9:00 PM"
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
          <Text style={[global_style.text, {  fontSize: 14, marginBottom: 20 }]}>
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
          <Text style={[global_style.text, {  fontSize: 14, marginBottom: 20 }]}>
            Food Catalogue
          </Text>
          
          {/* Food Type */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
              Food type *
            </Text>
            <CircularInputField
              placeHolder="e.g. 2 portions of Amala"
              value={foodType}
              onChange={setFoodType}
              type="text"
              obscureText={false}
            />
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <TouchableOpacity style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: color_scheme.grey_bg,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={14} color={color_scheme.placeholder_color} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stew Type */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
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
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
              Price Range *
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[global_style.text, { fontSize: 14, marginBottom: 5, color: color_scheme.placeholder_color }]}>
                  From
                </Text>
                <View style={[input_style.input_container, { borderRadius: 100, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 5 }]}>
                  <Text style={[global_style.text, { fontSize: 14, color: color_scheme.text_color }]}>N</Text>
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 14 }]}
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
                  <Text style={[global_style.text, { fontSize: 14, color: color_scheme.text_color }]}>N</Text>
                  <TextInput
                    style={[global_style.text, { flex: 1, fontSize: 14 }]}
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
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
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
            <Text style={[global_style.text, { color: color_scheme.light, fontSize: 14 }]}>
              Add another catalogue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Store Details Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[global_style.text, {  fontSize: 14, marginBottom: 20 }]}>
            Store Details
          </Text>
          
          {/* Store Description */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
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
            <Text style={[global_style.text, {  fontSize: 14, marginBottom: 10 }]}>
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
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#FF0000',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>!</Text>
            </View>
            <Text style={[global_style.text, { fontSize: 14, color: '#FF0000' }]}>
              Your submission will be reviewed by our team within 24-48 hours. We'll notify you once it's approved and live on the platform.
            </Text>
          </View>
        </View>

            {/* Submit Button */}
            <WideButton
              type="fill"
              onTap={handleSubmit}
              fillColor="#FF0000"
            >
              Submit for Review
            </WideButton>
          </>
        ) : (
          /* Verify Stores Content */
          <View>
            <Text style={[global_style.text, { 
              fontFamily: font_name_bold, 
              fontSize: 14, 
              marginBottom: 5,
              width: "80%"
              // textAlign: 'center'
            }]}>
              Verify new Amala stores near you!
            </Text>
            <Text style={[global_style.text, { 
              fontSize: 14, 
              color: color_scheme.placeholder_color,
              // textAlign: 'center',
              marginBottom: 30,
              lineHeight: 22
            }]}>
              Help us improve the ever growing community by verifying Amala stores close to you.
            </Text>

            {/* Store Card 1 */}
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#F0F0F0'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#2D5016',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: '#2D5016',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3
                }}>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>A</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[global_style.text, { 
                    fontSize: 14, 
                    fontFamily: font_name_bold, 
                    marginBottom: 3,
                    color: '#1A1A1A'
                  }]}>
                    Amala Earth
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                    <MapPin size={14} color={color_scheme.placeholder_color} />
                    <Text style={[global_style.text, { 
                      fontSize: 13, 
                      color: color_scheme.placeholder_color, 
                      marginLeft: 6,
                      flex: 1
                    }]}>
                      Along DLI road, Red Bricks
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Calendar size={14} color={color_scheme.placeholder_color} />
                    <Text style={[global_style.text, { 
                      fontSize: 13, 
                      color: color_scheme.placeholder_color, 
                      marginLeft: 6 
                    }]}>
                      8:30 am - 9:00 pm
                    </Text>
                    <View style={{
                      backgroundColor: '#10B981',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                      marginLeft: 8
                    }}>
                      <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>Open</Text>
                    </View>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[global_style.text, { 
                    fontSize: 14, 
                    fontFamily: font_name_bold, 
                    marginBottom: 3,
                    color: '#1A1A1A'
                  }]}>
                    N700 - N1,800
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#FFD700', fontSize: 14 }}>★</Text>
                    <Text style={[global_style.text, { 
                      fontSize: 14, 
                      marginLeft: 3,
                      fontFamily: font_name_bold,
                      color: '#1A1A1A'
                    }]}>4.9</Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1.5,
                  borderColor: '#FF0000',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                  shadowColor: '#FF0000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2
                }}>
                  <Text style={[global_style.text, { 
                    color: '#FF0000', 
                    fontSize: 14,
                    fontFamily: font_name_bold
                  }]}>
                    I haven't seen this
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  flex: 1,
                  backgroundColor: '#FF0000',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                  shadowColor: '#FF0000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4
                }}>
                  <Text style={[global_style.text, { 
                    color: 'white', 
                    fontSize: 14,
                    fontFamily: font_name_bold
                  }]}>
                    Yes! it's legit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Store Card 2 */}
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#F0F0F0'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#2D5016',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: '#2D5016',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3
                }}>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>A</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[global_style.text, { 
                    fontSize: 14, 
                    fontFamily: font_name_bold, 
                    marginBottom: 3,
                    color: '#1A1A1A'
                  }]}>
                    Amala Earth
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                    <MapPin size={14} color={color_scheme.placeholder_color} />
                    <Text style={[global_style.text, { 
                      fontSize: 13, 
                      color: color_scheme.placeholder_color, 
                      marginLeft: 6,
                      flex: 1
                    }]}>
                      Along DLI road, Red Bricks
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Calendar size={14} color={color_scheme.placeholder_color} />
                    <Text style={[global_style.text, { 
                      fontSize: 13, 
                      color: color_scheme.placeholder_color, 
                      marginLeft: 6 
                    }]}>
                      8:30 am - 9:00 pm
                    </Text>
                    <View style={{
                      backgroundColor: '#10B981',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                      marginLeft: 8
                    }}>
                      <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>Open</Text>
                    </View>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[global_style.text, { 
                    fontSize: 14, 
                    fontFamily: font_name_bold, 
                    marginBottom: 3,
                    color: '#1A1A1A'
                  }]}>
                    N700 - N1,800
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#FFD700', fontSize: 14 }}>★</Text>
                    <Text style={[global_style.text, { 
                      fontSize: 14, 
                      marginLeft: 3,
                      fontFamily: font_name_bold,
                      color: '#1A1A1A'
                    }]}>4.9</Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1.5,
                  borderColor: '#FF0000',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                  shadowColor: '#FF0000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2
                }}>
                  <Text style={[global_style.text, { 
                    color: '#FF0000', 
                    fontSize: 14,
                    fontFamily: font_name_bold
                  }]}>
                    I haven't seen this
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  flex: 1,
                  backgroundColor: '#FF0000',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                  shadowColor: '#FF0000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4
                }}>
                  <Text style={[global_style.text, { 
                    color: 'white', 
                    fontSize: 14,
                    fontFamily: font_name_bold
                  }]}>
                    Yes! it's legit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default NewPost
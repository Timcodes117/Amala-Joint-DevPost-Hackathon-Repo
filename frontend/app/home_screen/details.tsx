import { View, Text, ScrollView, Image, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import { color_scheme, font_name_bold } from '../../utils/constants/app_constants'
import { global_style } from '../../utils/stylesheets/general_style'
import BackButton from '../../components/buttons/back_button'
import { router } from 'expo-router'

const Details = () => {
  const { width, height } = Dimensions.get('window')
  return (
    <SafeAreaView>
      <View style={{ padding: 24, position: 'absolute', top: 10, left: 0, right: 0, zIndex: 1000 }}>
        <BackButton onTap={() => router.back()}  />
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
        <Image source={require('../../assets/images/ama2.jpg')}
          style={{ width: '100%', height: (height / 2) + 50, resizeMode: 'cover' }} />

        <View style={{ padding: 24, marginTop: -50, backgroundColor: color_scheme.light, borderTopLeftRadius: 16, borderTopRightRadius: 16, minHeight: height }}>
          <Text style={[global_style.text, { fontSize: 24, fontFamily: font_name_bold }]}>Mama Kemi's Kitchen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Details
import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login' options={{ title: "login", headerShown: false }}   />
        <Stack.Screen name='signup' options={{ title: "signup", headerShown: false }}  />
    </Stack>
  )
}

export default AuthLayout
import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='permission' options={{ title: "permission", headerShown: false }} />
      <Stack.Screen name='home' options={{ title: "home", headerShown: false }} />
      <Stack.Screen name='explore' options={{ title: "explore", headerShown: false }} />
      <Stack.Screen name='notification' options={{ title: "notification", headerShown: false }} />
      <Stack.Screen name='details' options={{ title: "details", headerShown: false }} />
      <Stack.Screen name='new_post' options={{ title: "new_post", headerShown: false }} />
      <Stack.Screen name='profile' options={{ title: "profile", headerShown: false }} />
      <Stack.Screen name='search' options={{ title: "search", headerShown: false }} />
      <Stack.Screen name='chat' options={{ title: "chat", headerShown: false }} />
    </Stack>
  )
}

export default HomeLayout
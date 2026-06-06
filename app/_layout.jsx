import React from 'react'
import { Stack } from 'expo-router'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })

  if (!fontsLoaded) return null

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 180,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Sign_In" />
      <Stack.Screen name="Create_Account" />
      <Stack.Screen name="Forgot_Password" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="map" />
      <Stack.Screen name="admin/admin_dashboard" />
      <Stack.Screen name="species_with_gps_coordinates_result" />
      <Stack.Screen name="health_camera" />
      <Stack.Screen name="health_results" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="profile" />
    </Stack>
  )
}

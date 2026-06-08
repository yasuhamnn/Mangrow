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
        animation: 'none', // Change to 'none' for no animation
        animationDuration: 0, // Set duration to 0 for no delay
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
      <Stack.Screen name="admin/admin_notification" />
      <Stack.Screen name="admin/admin_map" />
      <Stack.Screen name="admin/admin_verify" />
      <Stack.Screen name="admin/admin_profile" />
      <Stack.Screen name="admin/admin_edit_profile" />
      <Stack.Screen name="admin/admin_change_password" />
      <Stack.Screen name="species_with_gps_coordinates_result" />
      <Stack.Screen name="health_camera" />
      <Stack.Screen name="health_results" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit_profile" />
      <Stack.Screen name="change_password" />
      <Stack.Screen name="search" />
      <Stack.Screen name="settings" />
    </Stack>
  )
}

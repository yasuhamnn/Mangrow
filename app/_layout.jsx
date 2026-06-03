import { Stack } from 'expo-router'

export default function RootLayout() {
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
      <Stack.Screen name="admin/admin_dashboard" />
    </Stack>
  )
}

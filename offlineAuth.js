import AsyncStorage from '@react-native-async-storage/async-storage'

const USERS_KEY = 'OFFLINE_USERS'

// Save user locally
export const saveUserOffline = async (email, password, name) => {
  const users = JSON.parse(await AsyncStorage.getItem(USERS_KEY)) || []

  const existing = users.find(u => u.email === email)
  if (existing) throw new Error('User already exists offline')

  users.push({ email, password, name })
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Login offline
export const loginOffline = async (email, password) => {
  const users = JSON.parse(await AsyncStorage.getItem(USERS_KEY)) || []

  const user = users.find(
    u => u.email === email && u.password === password
  )

  if (!user) throw new Error('Invalid offline credentials')

  return user
}

// Get all offline users (for syncing)
export const getOfflineUsers = async () => {
  return JSON.parse(await AsyncStorage.getItem(USERS_KEY)) || []
}

// Clear after sync
export const clearOfflineUsers = async () => {
  await AsyncStorage.removeItem(USERS_KEY)
}
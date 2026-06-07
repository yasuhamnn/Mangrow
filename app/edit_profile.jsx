import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { auth, db } from '../firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setFormData({
              fullName: userDoc.data().fullName || '',
              email: userDoc.data().email || user.email || '',
            })
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      } finally {
        setFetching(false)
      }
    }
    fetchUserData()
  }, [])

  const handleUpdate = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Full name cannot be empty.')
      return
    }

    setLoading(true)
    try {
      const user = auth.currentUser
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          fullName: formData.fullName.trim(),
        })
        Alert.alert('Success', 'Profile updated successfully.')
        router.back()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#34A232" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-forward" size={20} color="#10200F" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERSONAL DETAILS</Text>
          <View style={styles.formCard}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="Enter full name"
                placeholderTextColor="#7B8177"
              />
            </View>

            <View style={[styles.inputWrapper, { borderBottomWidth: 0 }]}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.staticEmail}>{formData.email}</Text>
              <Text style={styles.hint}>Email cannot be changed for security reasons.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.disabledBtn]} 
          onPress={handleUpdate}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFCF7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 16,
  },
  title: { fontSize: 22, color: '#10200F', fontFamily: 'Montserrat_700Bold' },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: '#EFF5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { paddingHorizontal: 14, paddingTop: 18, paddingBottom: 40 },
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, letterSpacing: 1, color: '#6E756A', fontFamily: 'Montserrat_700Bold', marginBottom: 12, marginLeft: 4 },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  inputWrapper: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F5ED',
  },
  label: { fontSize: 10, color: '#34A232', fontFamily: 'Montserrat_700Bold', marginBottom: 8, textTransform: 'uppercase' },
  input: {
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
    color: '#10200F',
    padding: 0,
  },
  staticEmail: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#7B8177' },
  hint: { fontSize: 11, color: '#9CA3AF', marginTop: 6, fontFamily: 'Montserrat_400Regular', fontStyle: 'italic' },
  submitBtn: {
    backgroundColor: '#34A232',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { color: '#fff', fontSize: 15, fontFamily: 'Montserrat_700Bold' },
  disabledBtn: { opacity: 0.7 }
})
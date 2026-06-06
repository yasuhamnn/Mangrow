
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, Feather } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebaseConfig'
import BottomNav from './components/BottomNav'
import { doc, getDoc } from 'firebase/firestore'

export default function Profile() {
  const router = useRouter()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(10)).current

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          setLoading(false)
          return
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        } else {
          // fallback to auth profile if no Firestore doc
          setUserData({
            fullName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            role: 'volunteer',
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const fullName = userData?.fullName || 'User'
  const role = (userData?.role || 'volunteer').toUpperCase()
  const avatarInitial = (fullName || 'U').charAt(0).toUpperCase()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.replace('/Sign_In')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.85} onPress={handleSignOut}>
            <Feather name="log-out" size={17} color="#304018" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.roleText}>{role}</Text>
              <Text style={styles.nameText}>{fullName}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>SUBMITTED</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>RESOLVED</Text>
            </View>
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="leaf-outline" size={20} color="#6daa1a" />
            <Text style={styles.menuText}>My Contributions</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={20} color="#6daa1a" />
            <Text style={styles.menuText}>Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={20} color="#6daa1a" />
            <Text style={styles.menuText}>About the Model</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>


      </ScrollView>
      </Animated.View>

      <BottomNav activeTab="profile" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFCF7' },
  content: { padding: 16, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#10200F',
    letterSpacing: -0.3,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: '#EFF5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: '#CFEFC7',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A8D19F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#437105', fontFamily: 'Montserrat_700Bold', fontSize: 18 },

  profileInfo: { flex: 1 },
  roleText: { color: '#437105', fontSize: 10, fontFamily: 'Montserrat_600SemiBold', marginBottom: 2 },
  nameText: { color: '#0F1B0F', fontSize: 18, fontFamily: 'Montserrat_700Bold', marginBottom: 2 },
  subText: { color: '#374151', fontSize: 11, fontFamily: 'Montserrat_400Regular' },

  statsRow: { flexDirection: 'row', marginTop: 12, gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, color: '#2DA031', fontFamily: 'Montserrat_700Bold', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6E756A', fontFamily: 'Montserrat_600SemiBold' },

  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 8, marginBottom: 20 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECDD',
  },
  menuText: { flex: 1, fontSize: 14, color: '#10200F', fontFamily: 'Montserrat_600SemiBold', marginLeft: 12 },

})

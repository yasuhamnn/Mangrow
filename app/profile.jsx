
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native'
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

  const handleSignOut = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth)
              router.replace('/Sign_In')
            } catch (error) {
              Alert.alert('Error', 'Failed to log out.')
            }
          } 
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={handleSignOut}>
            <Feather name="log-out" size={20} color="#10200F" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: '#EFF5E8' }]}>
              <Text style={styles.avatarInitial}>{avatarInitial}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userRole}>{role}</Text>
          <View style={styles.emailBadge}>
            <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
          </View>
        </View>

        {/* Statistics Row (Nested in Profile or Separate) */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>REPORTS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>POINTS</Text>
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
          <View style={styles.settingsCard}>
            <SettingRow 
              icon="person-outline" 
              label="Edit Profile" 
              onPress={() => router.push('/edit_profile')}
            />
            <SettingRow 
              icon="lock-closed-outline" 
              label="Change Password" 
              onPress={() => router.push('/change_password')}
            />
            <SettingRow icon="shield-checkmark-outline" label="Privacy & Security" last />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUPPORT & APP</Text>
          <View style={styles.settingsCard}>
            <SettingRow icon="settings-outline" label="Preferences" />
            <SettingRow icon="help-circle-outline" label="About the Model" />
            <SettingRow icon="information-circle-outline" label="Help Center" last />
          </View>
        </View>

      </ScrollView>
      </Animated.View>

      <BottomNav activeTab="profile" />
    </SafeAreaView>
  )
}

const SettingRow = ({ icon, label, last, onPress }) => (
  <TouchableOpacity style={[styles.row, !last && styles.rowBorder]} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.rowLeft}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#34A232" />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFCF7' },
  content: { paddingHorizontal: 14, paddingTop: 18, paddingBottom: 140 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 16,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#10200F',
    letterSpacing: -0.3,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: '#EFF5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECDD',
    marginBottom: 24,
    shadowColor: '#A7B195',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { color: '#437105', fontFamily: 'Montserrat_700Bold', fontSize: 28 },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34A232',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    color: '#10200F',
    fontFamily: 'Montserrat_700Bold',
  },
  userRole: {
    fontSize: 13,
    color: '#7B8177',
    fontFamily: 'Montserrat_500Medium',
    marginTop: 4,
  },
  emailBadge: {
    backgroundColor: '#EFF5E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  userEmail: {
    fontSize: 12,
    color: '#437105',
    fontFamily: 'Montserrat_600SemiBold',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#6E756A',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 8,
    marginLeft: 4,
  },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, color: '#2DA031', fontFamily: 'Montserrat_700Bold', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6E756A', fontFamily: 'Montserrat_600SemiBold' },

  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F5ED' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F7FCF2', justifyContent: 'center', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: '#10200F', fontFamily: 'Montserrat_500Medium' },
})

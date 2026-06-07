import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { auth, db } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import AdminBottomNav from './AdminBottomNav'

export default function AdminProfile() {
  const router = useRouter();
  const [adminData, setAdminData] = useState({
    fullName: 'Admin',
    email: '',
  })

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = auth.currentUser
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setAdminData({
              fullName: userDoc.data().fullName || 'Admin',
              email: userDoc.data().email || user.email || '',
            })
          }
        }
      } catch (error) {
        console.error('Error fetching admin details:', error)
      }
    }
    fetchAdminData()
  }, [])

  const handleLogout = () => {
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={20} color="#10200F" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/app_logo.png')} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.adminName}>{adminData.fullName}</Text>
          <Text style={styles.adminRole}>Administrator</Text>
          <View style={styles.emailBadge}>
            <Text style={styles.adminEmail}>{adminData.email}</Text>
          </View>
        </View>

        {/* Settings Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
          <View style={styles.settingsCard}>
            <SettingRow 
              icon="person-outline" 
              label="Edit Profile" 
              onPress={() => router.push('/admin/admin_edit_profile')}
            />
            <SettingRow 
              icon="lock-closed-outline" 
              label="Change Password" 
              onPress={() => router.push('/admin/admin_change_password')}
            />
            <SettingRow icon="shield-checkmark-outline" label="Privacy & Security" last />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUPPORT & APP</Text>
          <View style={styles.settingsCard}>
            <SettingRow icon="help-buoy-outline" label="Help Center" />
            <SettingRow icon="chatbox-ellipses-outline" label="Feedback" />
            <SettingRow icon="information-circle-outline" label="About Mangrow" last />
          </View>
        </View>
      </ScrollView>

      <AdminBottomNav activeTab="profile" />
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
  container:{
    flex: 1,
    backgroundColor: '#FBFCF7',
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: '#10200F',
    fontFamily: 'Montserrat_700Bold',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: '#EFF5E8',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EFF5E8',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34A232',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminName: {
    fontSize: 20,
    color: '#10200F',
    fontFamily: 'Montserrat_700Bold',
  },
  adminRole: {
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
  adminEmail: {
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
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F5ED',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F7FCF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: '#10200F',
    fontFamily: 'Montserrat_500Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFE7E7',
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFD1D1',
  },
  logoutText: {
    fontSize: 15,
    color: '#FF3B30',
    fontFamily: 'Montserrat_700Bold',
  },
})
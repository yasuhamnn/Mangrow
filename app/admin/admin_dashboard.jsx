import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Animated } from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useRouter, Link } from 'expo-router'
import { auth, db } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import AdminBottomNav from './AdminBottomNav'

const ADMIN_TOOLS = [
  {
    key: 'verify',
    title: 'Verification',
    icon: 'shield-checkmark-outline',
    href: '/admin/admin_verify',
  },
  {
    key: 'map',
    title: 'Monitor Map',
    icon: 'location-outline',
    href: '/admin/admin_map',
  },
  {
    key: 'alerts',
    title: 'View Alerts',
    icon: 'notifications-outline',
    href: '/admin/admin_notification',
  },
  {
    key: 'profile',
    title: 'Admin Profile',
    icon: 'person-outline',
    href: '/admin/admin_profile',
  },
]

export default function AdminDashboard() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(10)).current
  const [adminName, setAdminName] = useState('Admin')

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = auth.currentUser
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const fullName = userDoc.data().fullName || 'Admin'
            // Get the first name
            const firstName = fullName.trim().split(/\s+/)[0]
            setAdminName(firstName)
          }
        }
      } catch (error) {
        console.error('Error fetching admin name:', error)
      }
    }
    fetchAdminData()
  }, [])

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

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.replace('/Sign_In')}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="#10200F" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <Image
              source={require('../../assets/app_logo.png')}
              style={styles.heroLogo}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroEyebrow}>
                ADMIN, {adminName.toUpperCase()} 👋
              </Text>
              <Text style={styles.heroTitle}>Manage Mangrove Health{'\n'}</Text>
              <Text style={styles.subtitle}>
                Review reports and monitor ecosystems
              </Text>
              <Link href="/admin/admin_verify" asChild>
                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.88}>
                  <Text style={styles.submitText}>Verify Reports →</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>PENDING</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>VERIFIED</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>ALERTS</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Admin Tools</Text>
          </View>

          <View style={styles.toolsGrid}>
            {ADMIN_TOOLS.map((tool) => (
              <TouchableOpacity 
                key={tool.key} 
                style={styles.toolCard} 
                activeOpacity={0.88}
                onPress={() => router.push(tool.href)}
              >
                <View style={styles.toolIconWrap}>
                  <Ionicons name={tool.icon} size={22} color="#2C8F2F" />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/admin/admin_notification')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {[
            {
              id: '1',
              status: 'Under Review',
              adminName: 'Dave',
              location: 'Manila Bay – North Pier',
              health: 'Unhealthy',
              image: require('../../assets/app_logo.png'),
            },
            {
              id: '2',
              status: 'Resolved',
              adminName: 'Maria',
              location: 'Cavite Coastal Reserve',
              health: 'Unhealthy',
              image: require('../../assets/app_logo.png'),
            },
            {
              id: '3',
              status: 'Active',
              adminName: 'Leo',
              location: 'Bogo City Mangroves',
              health: 'Unhealthy',
              image: require('../../assets/app_logo.png'),
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.activityCard}
              activeOpacity={0.85}
            >
              {/* Status Header */}
              <View style={[
                styles.statusHeader, 
                item.status === 'Active' ? styles.activeBanner : 
                item.status === 'Under Review' ? styles.reviewBanner : 
                styles.resolvedBanner
              ]}>
                <Text style={[
                  styles.statusHeaderText, 
                  { color: item.status === 'Active' ? '#FF3B30' : item.status === 'Under Review' ? '#C98A00' : '#2DA031' }
                ]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>

              {/* Content Redesign */}
              <View style={styles.activityBody}>
                <Image source={item.image} style={styles.reportImage} />
                <View style={styles.activityInfo}>
                  <Text style={styles.adminNameText}>Verified by: <Text style={{fontFamily: 'Montserrat_700Bold'}}>{item.adminName}</Text></Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={12} color="#7B8177" />
                    <Text style={styles.reportLocation}>{item.location}</Text>
                  </View>
                  <View style={styles.healthRow}>
                    <View style={[styles.healthDot, { backgroundColor: '#FF3B30' }]} />
                    <Text style={[styles.healthText, { color: '#FF3B30' }]}>
                      {item.health}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <AdminBottomNav activeTab="home" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
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
  heroCard: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#CFEFC7',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  heroContent: {
    zIndex: 1,
  },
  heroLogo: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 200,
    height: 170,
    opacity: 0.45,
  },
  heroEyebrow: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#437105',
    letterSpacing: 0.15,
  },
  heroTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: 24,
    color: '#0F1B0F',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 14,
    fontFamily: 'Montserrat_400Regular',
    bottom: 18,
  },
  submitBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#34A232',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 24,
    color: '#2DA031',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 0.9,
    color: '#6E756A',
    fontFamily: 'Montserrat_600SemiBold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: '#10200F',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#34A232',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  toolCard: {
    width: '48%',
    minHeight: 94,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    padding: 12,
    borderColor: '#E8ECDD',
    justifyContent: 'space-between',
    elevation: 1,
  },
  toolIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#DDF3D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTitle: {
    fontSize: 13,
    color: '#437105',
    fontFamily: 'Montserrat_600SemiBold',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    marginBottom: 12,
    overflow: 'hidden',
  },
  statusHeader: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'flex-start',
  },
  statusHeaderText: {
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  activityBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  reportImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FBFCF7',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 14,
  },
  reportLocation: {
    fontSize: 12,
    color: '#7B8177',
    fontFamily: 'Montserrat_400Regular',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  adminNameText: {
    fontSize: 13,
    color: '#10200F',
    fontFamily: 'Montserrat_500Medium',
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  healthText: {
    fontSize: 11,
    fontFamily: 'Montserrat_600SemiBold',
  },
  activeBanner: { backgroundColor: '#FFE7E7' },
  resolvedBanner: { backgroundColor: '#DDF3D6' },
  reviewBanner: { backgroundColor: '#FFF2D9' },
})
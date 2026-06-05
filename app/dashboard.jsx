import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { auth } from '../firebaseConfig'
import { getCurrentOfflineUser } from '../offlineAuth'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'

const QUICK_TOOLS = [
  {
    key: 'scan',
    title: 'Scan',
    icon: 'camera-outline',
  },
  {
    key: 'map',
    title: 'Map',
    icon: 'location-outline',
  },
  {
    key: 'reports',
    title: 'My Reports',
    icon: 'time-outline',
  },
  {
    key: 'notification',
    title: 'Notification',
    icon: 'sparkles-outline',
  },
]

function getFirstName(name) {
  if (!name) {
    return 'Friend'
  }

  const firstName = name.trim().split(/\s+/)[0]
  return firstName || 'Friend'
}



export default function Dashboard() {
  const [greetingName, setGreetingName] = useState('Friend')

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(15)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })
  

  useEffect(() => {
    const loadGreetingName = async () => {
      const currentUser = auth.currentUser
      const offlineUser = await getCurrentOfflineUser()

      const displayName =
        currentUser?.displayName ||
        offlineUser?.name ||
        currentUser?.email?.split('@')[0] ||
        offlineUser?.email?.split('@')[0] ||
        'Friend'

      setGreetingName(getFirstName(displayName))
    }

    loadGreetingName()
  }, [])

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.brandWrap}>
              <Text style={styles.brandText}>Mangrow</Text>
            </View>

            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.85}>
              <Feather name="settings" size={17} color="#304018" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <Image
              source={require('../assets/app_logo.png')}
              style={styles.heroLogo}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroEyebrow}>
                HI, {greetingName.toUpperCase()} 👋
              </Text>
              <Text style={styles.heroTitle}>Protect mangroves with us{'\n'}</Text>
              <Text style={styles.subtitle}>
                Monitor mangroves, protect coastlines
              </Text>
              <TouchableOpacity style={styles.submitBtn} activeOpacity={0.88}>
                <Text style={styles.submitText}>Submit →</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>UNHEALTHY</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>HEALTHY</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>RESOLVED</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Quick Tools</Text>

          <View style={styles.toolsGrid}>
            {QUICK_TOOLS.map((tool) => (
              <TouchableOpacity
                key={tool.key}
                style={styles.toolCard}
                activeOpacity={0.88}
              >
                <View style={styles.toolIconWrap}>
                  <Ionicons name={tool.icon} size={22} color="#2C8F2F" />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      <View style={styles.bottomNavSafeArea} pointerEvents="none" />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Feather name="home" size={18} color="#3D5F18" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <View style={styles.navIconWrap}>
            <Feather name="file-text" size={18} color="#B8BEB3" />
            <View style={styles.reportBadge}>
              <Ionicons name="add" size={8} color="#fff" />
            </View>
          </View>
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>

        <Link href="/camera" asChild>
          <TouchableOpacity style={styles.cameraWrapper} activeOpacity={0.86}>
            <View style={styles.cameraBackground}>
              <View style={styles.cameraButton}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <View style={styles.navIconWrap}>
            <Feather name="bell" size={18} color="#B8BEB3" />
          </View>
          <Text style={styles.navText}>Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Feather name="user" size={18} color="#B8BEB3" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 14,
    },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandText: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#10200F',
    letterSpacing: -0.3,
  },

  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroCard: {
    width: '100%',  
    borderRadius: 18,
    backgroundColor: '#CFEFC7',
    overflow: 'hidden',
    flexDirection: 'column',
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  heroContent: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },

  heroLogo: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 200,
    height: 170,
    opacity: 1,
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
    fontWeight: '400',
    bottom: 18,
  },

  submitBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    lineHeight: 15,
    letterSpacing: -0.1,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  statValue: {
    fontSize: 24,
    lineHeight: 26,
    color: '#2DA031',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 5,
    letterSpacing: -0.3,
  },

  statLabel: {
    fontSize: 10,
    letterSpacing: 0.9,
    color: '#6E756A',
    fontFamily: 'Montserrat_600SemiBold',
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: 22,
    color: '#10200F',
    letterSpacing: -0.25,
    marginBottom: 12,
    marginTop: 12,
    
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
    /* subtle shadow similar to statCard */
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderColor: '#E8ECDD',
    justifyContent: 'space-between',
  },

  toolIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#DDF3D6',
    /* ensure no border */
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolTitle: {
    fontSize: 13,
    lineHeight: 15,
    color: '#437105',
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: -0.15,
    maxWidth: 90,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 17,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  
  },

  bottomNavSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#fff',
  },

  navItem: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
  },

  navIconWrap: {
    width: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navText: {
    marginTop: 1,
    fontSize: 8,
    fontFamily: 'Montserrat_400Regular',
    lineHeight: 10,
    color: '#8E958A',
  },

  activeNavText: {
    color: '#3D5F18',
  },

  cameraWrapper: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    marginTop: -20,
  },

  cameraBackground: {
    width: 60,
    height: 60,
    borderRadius: 29,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraButton: {
    width: 46,
    height: 46,
    borderRadius: 22,
    backgroundColor: '#3EAA2B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reportBadge: {
    position: 'absolute',
    top: -4,
    right: -2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#FF7A2F',
    borderWidth: 1.25,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

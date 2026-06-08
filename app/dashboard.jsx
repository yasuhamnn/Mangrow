import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Ionicons, Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { auth } from '../firebaseConfig'
import BottomNav from './components/BottomNav'
import { getCurrentOfflineUser } from '../offlineAuth'

const QUICK_TOOLS = [
  {
    key: 'scan',
    title: 'Scan',
    icon: 'camera-outline',
    href: '/camera',
  },
  {
    key: 'map',
    title: 'Map',
    icon: 'location-outline',
    href: '/map',
  },
  {
    key: 'reports',
    title: 'My Reports',
    icon: 'time-outline',
    href: '/profile',
  },
  {
    key: 'notification',
    title: 'Notification',
    icon: 'sparkles-outline',
    href: '/notification',
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
  const slideAnim = useRef(new Animated.Value(10)).current

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

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.brandWrap}>
              <Text style={styles.brandText}>Dashboard</Text>
            </View>

            <Link href="/settings" asChild>
              <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.85}>
                <Feather name="settings" size={17} color="#304018" />
              </TouchableOpacity>
            </Link>
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
              <Link href="/camera" asChild>
                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.88}>
                  <Text style={styles.submitText}>Submit →</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>UNHEALTHY</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>RESOLVED</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>MY REPORT</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Tools</Text>
          </View>

          <View style={styles.toolsGrid}>
            {QUICK_TOOLS.map((tool) => {
              const cardContent = (
                <>
                  <View style={styles.toolIconWrap}>
                    <Ionicons name={tool.icon} size={22} color="#2C8F2F" />
                  </View>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                </>
              );

              if (tool.href) {
                return (
                  <Link key={tool.key} href={tool.href} asChild>
                    <TouchableOpacity style={styles.toolCard} activeOpacity={0.88}>
                      {cardContent}
                    </TouchableOpacity>
                  </Link>
                );
              }

              return (
                <TouchableOpacity key={tool.key} style={styles.toolCard} activeOpacity={0.88}>
                  {cardContent}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* --- Recent Reports Section --- */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity onPress={() => { }}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {[
            {
              id: '1',
              species: 'Rhizophora apiculata',
              location: 'Manila Bay – North Pier',
              health: 'Unhealthy',
              status: 'Active',
              image: require('../assets/app_logo.png'), // placeholder
            },
            {
              id: '2',
              species: 'Avicennia marina',
              location: 'Cavite Coastal Reserve',
              health: 'Unhealthy',
              status: 'Active',
              image: require('../assets/app_logo.png'), // placeholder
            },
            {
              id: '3',
              species: 'Sonneratia alba',
              location: 'Las Piñas Wetland',
              health: 'Unhealthy',
              status: 'Under Review',
              image: require('../assets/app_logo.png'), // placeholder
            },
          ].map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              activeOpacity={0.85}
            >
              <Image source={report.image} style={styles.reportImage} />

              <View style={styles.reportContent}>
                <Text style={styles.reportSpecies}>{report.species}</Text>
                <Text style={styles.reportLocation}>{report.location}</Text>

                <View style={styles.reportFooter}>
                  <View style={styles.healthRow}>
                    <View
                      style={[
                        styles.healthDot,
                        { backgroundColor: report.health === 'Healthy' ? '#2DA031' : '#FF4D4F' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.healthText,
                        { color: report.health === 'Healthy' ? '#2DA031' : '#FF4D4F' },
                      ]}
                    >
                      {report.health}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      report.status === 'Resolved'
                        ? styles.resolvedBadge
                        : report.status === 'Active'
                          ? styles.activeBadge
                          : styles.reviewBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <BottomNav activeTab="home" />
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
    marginBottom: 16,
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
    borderRadius: 15,
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
    marginBottom: 20,
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
    lineHeight: 22,
    color: '#10200F',
    letterSpacing: -0.25,
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
    /* subtle shadow similar to statCard */
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderColor: '#E8ECDD',
    justifyContent: 'space-between',
    shadowColor: '#A7B195',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
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

  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    padding: 12,
    marginBottom: 12,
  },

  reportImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  reportContent: {
    flex: 1,
    marginLeft: 12,
  },

  reportSpecies: {
    fontSize: 14,
    color: '#10200F',
    fontFamily: 'Montserrat_700Bold',
  },

  reportLocation: {
    fontSize: 11,
    color: '#7B8177',
    fontFamily: 'Montserrat_400Regular',
    marginTop: 2,
  },

  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  healthText: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
  },

  statusBadge: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  activeBadge: { backgroundColor: '#FFE7E7' },
  resolvedBadge: { backgroundColor: '#DDF3D6' },
  reviewBadge: { backgroundColor: '#FFF2D9' },

  statusText: {
    fontSize: 10,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#10200F',
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

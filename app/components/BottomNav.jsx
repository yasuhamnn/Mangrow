import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'

const TABS = [
  { key: 'home', label: 'Home', icon: 'home', iconFamily: 'Feather', href: '/dashboard' },
  { key: 'map', label: 'Map', icon: 'map', iconFamily: 'Feather', href: '/map' },
  { key: 'camera', label: null, icon: 'camera-outline', iconFamily: 'Ionicons', href: '/camera', isCenter: true },
  { key: 'alert', label: 'Alert', icon: 'bell', iconFamily: 'Feather', href: '/notification' },
  { key: 'profile', label: 'Profile', icon: 'user', iconFamily: 'Feather', href: '/profile' },
]

export default function BottomNav({ activeTab = 'home' }) {
  return (
    <>
      <View style={styles.bottomNavSafeArea} pointerEvents="none" />
      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key

          if (tab.isCenter) {
            return (
              <Link key={tab.key} href={tab.href} asChild>
                <TouchableOpacity style={styles.cameraWrapper} activeOpacity={0.86}>
                  <View style={styles.cameraBackground}>
                    <View style={styles.cameraButton}>
                      <Ionicons name="camera-outline" size={20} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            )
          }

          const iconColor = isActive ? '#3D5F18' : '#B8BEB3'

          if (tab.href) {
            return (
              <Link key={tab.key} href={tab.href} asChild>
                <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
                  <View style={styles.navIconWrap}>
                    <Feather name={tab.icon} size={18} color={iconColor} />
                    {tab.key === 'alert' && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>1</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.navText, isActive && styles.activeNavText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              </Link>
            )
          }

          return (
            <View key={tab.key} style={styles.navItem}>
              <View style={styles.navIconWrap}>
                <Feather name={tab.icon} size={18} color={iconColor} />
                {tab.key === 'alert' && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>1</Text>
                  </View>
                )}
              </View>
              <Text style={styles.navText}>{tab.label}</Text>
            </View>
          )
        })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    marginTop: 4,
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
    lineHeight: 12,
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
    marginTop: -30,
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

  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF4D4F',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: 10,
  },
})

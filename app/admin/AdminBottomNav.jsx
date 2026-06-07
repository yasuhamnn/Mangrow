import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'

const TABS = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    href: '/admin/admin_dashboard',
  },
  {
    key: 'map',
    label: 'Map',
    icon: 'map',
    href: '/admin/admin_map',
  },
  {
    key: 'verify',
    icon: 'shield-checkmark-outline',
    href: '/admin/admin_verify',
    isCenter: true,
  },
  {
    key: 'alert',
    label: 'Alert',
    icon: 'bell',
    href: '/admin/admin_notification',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: 'user',
    href: '/admin/admin_profile',
  },
]

export default function AdminBottomNav({ activeTab = 'home' }) {
  return (
    <>
      <View style={styles.bottomNavSafeArea} />

      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key

          if (tab.isCenter) {
            return (
              <Link key={tab.key} href={tab.href} asChild>
                <TouchableOpacity
                  style={styles.cameraWrapper}
                  activeOpacity={0.86}
                >
                  <View style={styles.cameraBackground}>
                    <View style={styles.cameraButton}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color="#fff"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            )
          }

          return (
            <Link key={tab.key} href={tab.href} asChild>
              <TouchableOpacity
                style={styles.navItem}
                activeOpacity={0.8}
              >
                <View style={styles.navIconWrap}>
                  <Feather
                    name={tab.icon}
                    size={18}
                    color={isActive ? '#3D5F18' : '#B8BEB3'}
                  />

                  {tab.key === 'alert' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>2</Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.navText,
                    isActive && styles.activeNavText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </Link>
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
    color: '#8E958A',
  },

  activeNavText: {
    color: '#3D5F18',
  },

  cameraWrapper: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },

  cameraBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3EAA2B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF4D4F',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#fff',
    fontSize: 8,
  },
})
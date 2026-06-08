import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function Settings() {
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(10)).current

  const [pushEnabled, setPushEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)

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
      <Animated.View style={[styles.main, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-forward" size={20} color="#10200F" />
            </TouchableOpacity>
          </View>

          {/* General Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GENERAL</Text>
            <View style={styles.settingsCard}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons name="notifications-outline" size={20} color="#34A232" />
                  </View>
                  <Text style={styles.rowLabel}>Push Notifications</Text>
                </View>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: '#D1D5DB', true: '#CFEFC7' }}
                  thumbColor={pushEnabled ? '#34A232' : '#F4F3F4'}
                />
              </View>
              
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons name="location-outline" size={20} color="#34A232" />
                  </View>
                  <Text style={styles.rowLabel}>Location Access</Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: '#D1D5DB', true: '#CFEFC7' }}
                  thumbColor={locationEnabled ? '#34A232' : '#F4F3F4'}
                />
              </View>

              <SettingRow 
                icon="language-outline" 
                label="Language" 
                value="English"
                last
              />
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT MANGROW</Text>
            <View style={styles.settingsCard}>
              <SettingRow icon="document-text-outline" label="Terms of Service" />
              <SettingRow icon="shield-outline" label="Privacy Policy" />
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={styles.iconBox}>
                    <Feather name="info" size={20} color="#34A232" />
                  </View>
                  <Text style={styles.rowLabel}>App Version</Text>
                </View>
                <Text style={styles.versionText}>1.0.0 (Build 24)</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}

const SettingRow = ({ icon, label, value, last, onPress }) => (
  <TouchableOpacity style={[styles.row, !last && styles.rowBorder]} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.rowLeft}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#34A232" />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value && <Text style={styles.valueText}>{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFCF7' },
  main: { flex: 1 },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: '#EFF5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#10200F',
  },
  content: { paddingHorizontal: 14, paddingTop: 18, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionLabel: { 
    fontSize: 11, 
    fontFamily: 'Montserrat_700Bold', 
    color: '#6E756A', 
    letterSpacing: 1, 
    marginBottom: 10, 
    marginLeft: 4 
  },
  settingsCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E8ECDD', 
    overflow: 'hidden' 
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F5ED' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F7FCF2', justifyContent: 'center', alignItems: 'center' },
  rowLabel: { fontSize: 15, color: '#10200F', fontFamily: 'Montserrat_500Medium' },
  valueText: { fontSize: 14, color: '#7B8177', fontFamily: 'Montserrat_400Regular' },
  versionText: { fontSize: 13, color: '#9CA3AF', fontFamily: 'Montserrat_400Regular' },
})
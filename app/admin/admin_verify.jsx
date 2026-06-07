import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AdminBottomNav from './AdminBottomNav'

export default function AdminVerify() {
  const router = useRouter()
  const [filter, setFilter] = useState('new') // 'new' or 'resolution'

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Verification</Text>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#10200F"
          />
        </TouchableOpacity>
      </View>

      {/* VERIFICATION TYPE SELECTOR */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, filter === 'new' && styles.activeTab]}
            onPress={() => setFilter('new')}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabText, filter === 'new' && styles.activeTabText]}>New Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, filter === 'resolution' && styles.activeTab]}
            onPress={() => setFilter('resolution')}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabText, filter === 'resolution' && styles.activeTabText]}>Resolutions</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* REPORT CARD */}
        {filter === 'new' ? (
        <View style={styles.card}>
          {/* IMAGE */}
          <Image source={require('../../assets/app_logo.png')} style={styles.reportImage} />

          {/* SPECIES */}
          <Text style={styles.speciesName}>
            Rhizophora apiculata
          </Text>

          {/* INFO GRID */}
          <View style={styles.infoGrid}>
            <View style={styles.infoPill}>
              <Ionicons
                name="location-outline"
                size={16}
                color="#10200F"
              />
              <Text style={styles.infoText}>
                Manila Bay – North Pier
              </Text>
            </View>

            <View style={styles.infoPill}>
              <Ionicons
                name="person-outline"
                size={16}
                color="#10200F"
              />
              <Text style={styles.infoText}>
                Ana Cruz
              </Text>
            </View>

            <View style={styles.infoPill}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color="#10200F"
              />
              <Text style={styles.infoText}>
                6/4/2026
              </Text>
            </View>

            <View style={styles.infoPill}>
              <View style={styles.redDot} />
              <Text style={styles.unhealthyText}>
                Unhealthy
              </Text>
            </View>
          </View>

          {/* NOTES */}
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>
              Field notes
            </Text>

            <Text style={styles.notesText}>
              Plastic debris around root system.
              Naay oil sa iyang palibot.
            </Text>
          </View>

          {/* COORDS */}
          <Text style={styles.coordinates}>
            Coordinates: 14.5995°N, 120.9842°E
          </Text>
        </View>
        ) : (
          /* RESOLUTION CARD (Placeholder UI) */
          <View style={styles.card}>
            <Image source={require('../../assets/app_logo.png')} style={styles.reportImage} />
            <Text style={styles.speciesName}>
              Avicennia marina
            </Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoPill}>
                <Ionicons name="location-outline" size={16} color="#10200F" />
                <Text style={styles.infoText}>Bogo City Mangroves</Text>
              </View>
              <View style={styles.infoPill}>
                <Ionicons name="person-outline" size={16} color="#10200F" />
                <Text style={styles.infoText}>Juan Dela Cruz</Text>
              </View>
              <View style={styles.infoPill}>
                <Ionicons name="calendar-outline" size={16} color="#10200F" />
                <Text style={styles.infoText}>6/5/2026</Text>
              </View>
              <View style={styles.infoPill}>
                <View style={[styles.redDot, { backgroundColor: '#34A232' }]} />
                <Text style={[styles.unhealthyText, { color: '#34A232' }]}>Resolved</Text>
              </View>
            </View>
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>Volunteer Resolution Notes</Text>
              <Text style={styles.notesText}>
                Debris removed and protective fencing installed around the root cluster.
              </Text>
            </View>
            <Text style={styles.coordinates}>
              Verified Outcome: Healthy
            </Text>
          </View>
        )}

        {/* ACTION BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.rejectButton}
            activeOpacity={0.85}
          >
            <Feather
              name="x"
              size={16}
              color="#FF4D4F"
            />
            <Text style={styles.rejectText}>
              Reject
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={filter === 'new' ? styles.approveButton : styles.reviewButton}
            activeOpacity={0.85}
          >
            <Feather
              name={filter === 'new' ? "check" : "eye"}
              size={16}
              color={filter === 'new' ? "#FFFFFF" : "#C98A00"}
            />
            <Text style={filter === 'new' ? styles.approveText : styles.reviewText}>
              {filter === 'new' ? 'Approve' : 'Review'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <AdminBottomNav activeTab="verify" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFCF7',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 22,
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

  tabWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  tabText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#6B7280',
  },

  activeTabText: {
    color: '#34A232',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8ECDD',
  },

  reportImage: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
    backgroundColor: '#FBFCF7',
  },

  reportId: {
    marginTop: 16,
    marginHorizontal: 18,
    fontSize: 12,
    letterSpacing: 1,
    color: '#647067',
    fontFamily: 'Montserrat_600SemiBold',
  },

  speciesName: {
    marginTop: 8,
    marginHorizontal: 18,
    fontSize: 24,
    color: '#10200F',
    fontFamily: 'Montserrat_700Bold',
  },

  infoGrid: {
    marginTop: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  infoPill: {
    width: '48%',
    backgroundColor: '#F7FCF2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 8,
    color: '#10200F',
    fontSize: 13,
    fontFamily: 'Montserrat_500Medium',
  },

  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 2,
    marginRight: 8,
  },

  unhealthyText: {
    color: '#FF3B30',
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
  },

  notesBox: {
    marginTop: 16,
    marginHorizontal: 18, 
    backgroundColor: '#DDF3D6',
    borderRadius: 15,
    padding: 16,
  },

  notesTitle: {
    fontSize: 14,
    color: '#10200F',
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
  },

  notesText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#10200F',
    fontFamily: 'Montserrat_400Regular',
  },

  coordinates: {
    marginTop: 14,
    marginBottom: 20,
    marginHorizontal: 18,
    color: '#7B8079',
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 4,
  },

  rejectButton: {
    width: '46%',
    height: 40,
    backgroundColor: '#F7E6E6',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  approveButton: {
    width: '46%',
    height: 40,
    backgroundColor: '#37A524',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#37A524',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  rejectText: {
    marginLeft: 8,
    color: '#FF4D4F',
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
  },

  approveText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
  },

  reviewButton: {
    width: '46%',
    height: 40,
    backgroundColor: '#FFF2D9',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reviewText: {
    marginLeft: 8,
    color: '#C98A00',
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
  },
})
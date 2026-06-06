import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Text, Dimensions, Animated, TouchableOpacity, ScrollView, Image, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import BottomNav from './components/BottomNav'

const { height } = Dimensions.get('window')

// Static asset and data defined outside to fix RTCimageView source issues and improve performance
const APP_LOGO = require('../assets/app_logo.png')

const FILTERS = ['All', 'Unhealthy', 'Active', 'Under Review', 'Resolved']

const REPORTS_DATA = [
  {
    id: 1,
    species: 'Rhizophora apiculata',
    location: 'Manila Bay – North Pier',
    date: '6/4/2026',
    status: 'Active',
    health: 'Unhealthy',
    image: APP_LOGO,
  },
  {
    id: 2,
    species: 'Avicennia marina',
    location: 'Cavite Coastal Reserve',
    date: '6/3/2026',
    status: 'Active',
    health: 'Unhealthy',
    image: APP_LOGO,
  },
  {
    id: 3,
    species: 'Sonneratia alba',
    location: 'Las Piñas Wetland',
    date: '6/2/2026',
    status: 'Under Review',
    health: 'Unhealthy',
    image: APP_LOGO,
  },
  {
    id: 4,
    species: 'Ceriops tagal',
    location: 'Palawan Mangrove Park',
    date: '6/1/2026',
    status: 'Active',
    health: 'Unhealthy',
    image: APP_LOGO,
  },
  {
    id: 5,
    species: 'Bruguiera gymnorhiza',
    location: 'Bohol Coastal Area',
    date: '5/30/2026',
    status: 'Active',
    health: 'Unhealthy',
    image: APP_LOGO,
  },
  {
    id: 6,
    species: 'Lumnitzera racemosa',
    location: 'Cebu Marine Sanctuary',
    date: '5/28/2026',
    status: 'Active',
    health: 'Unhealthy',
    image: APP_LOGO,
  },
]

export default function MapScreen() {
  const [activeFilter, setActiveFilter] = useState('All')
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

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet/dist/leaflet.css"
      />
      <style>
          html, body, #map {
              height:100%;
              margin:0;
              padding:0;
          }
          .leaflet-container {
            background: #f3f7ef;
          }
      </style>
  </head>
  <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
          var map = L.map('map', {zoomControl: true, minZoom: 12, maxZoom: 18, attributionControl: false}).setView([11.0519, 124.0055], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(map);
          var unhealthyAreas = [
            [11.0600,124.0100],
            [11.0450,124.0010],
            [11.0555,124.0150]
          ];
          unhealthyAreas.forEach(function(coords) {
            L.marker(coords, {icon: L.icon({
              iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              iconSize: [32,32],
              iconAnchor: [16,32]
            })}).addTo(map).bindPopup("Unhealthy Mangrove Area");
          });
      </script>
  </body>
  </html>
  `

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}
      >
        <View style={styles.topSection}>
          <Text style={styles.header}>Map</Text>

          <View style={styles.mapBox}>
            <WebView
              originWhitelist={['*']}
              source={{ html }}
              style={{ flex: 1 }}
              javaScriptEnabled
              domStorageEnabled
              nestedScrollEnabled
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Sticky Container: Filters + Submit Button */}
        <View style={styles.stickyRowContainer}>
          <View style={styles.stickyRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
              style={{ flex: 1 }}
            >
              {FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, activeFilter === filter && styles.activeChip]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterChipText, activeFilter === filter && styles.activeChipText]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Report List */}
        <View style={styles.reportContainer}>
          {REPORTS_DATA.map((report) => (
            <TouchableOpacity key={report.id} style={styles.reportCard} activeOpacity={0.85}>
              <Image source={report.image} style={styles.reportImage} />
              <View style={styles.reportContent}>
                <View style={styles.reportHeader}>
                  <Text style={styles.speciesText}>{report.species}</Text>
                  <View style={[
                    styles.statusBadge,
                    report.status === 'Resolved' ? styles.resolvedBadge :
                    report.status === 'Active' ? styles.activeBadge :
                    styles.reviewBadge
                  ]}>
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                </View>

                <Text style={styles.locationText}>{report.location}</Text>

                <View style={styles.reportFooter}>
                  <View style={styles.healthRow}>
                    <View style={[
                      styles.healthIndicator,
                      { backgroundColor: report.health === 'Healthy' ? '#2DA031' : '#FF4D4F' }
                    ]}/>
                    <Text style={[
                      styles.healthText,
                      { color: report.health === 'Healthy' ? '#2DA031' : '#FF4D4F' }
                    ]}>{report.health}</Text>
                  </View>
                </View>

                {report.status === 'Active' && (
                  <>
                    <View style={styles.actionSeparator} />
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                      <Text style={styles.actionText}>Submit resolution →</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      <BottomNav activeTab="map" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFCF7' },
  topSection: { paddingHorizontal: 14, paddingTop: 18 },
  header: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#10200F', marginBottom: 12, letterSpacing: -0.3 },
  mapBox: {
    height: height * 0.55,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8ECDD',
    backgroundColor: '#fff',
    shadowColor: '#A7B195',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 4,
  },
  stickyRowContainer: { backgroundColor: '#FBFCF7', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F2E8' },
  stickyRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  filterContainer: { paddingVertical: 4, paddingRight: 10 },
  filterChip: { height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#F4F6F1', borderWidth: 1, borderColor: '#D9DED1', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  activeChip: { backgroundColor: '#3DAA2B', borderColor: '#3DAA2B' },
  filterChipText: { fontSize: 11, color: '#10200F', fontFamily: 'Montserrat_600SemiBold' },
  activeChipText: { color: '#FFFFFF' },

  reportContainer: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 100 },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#E8ECDD', padding: 12, marginBottom: 10 },
  reportImage: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
  reportContent: { flex: 1, marginLeft: 12 },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  speciesText: { fontSize: 14, fontFamily: 'Montserrat_700Bold', color: '#10200F', flexShrink: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadge: { backgroundColor: '#FFE7E7' },
  resolvedBadge: { backgroundColor: '#DDF3D6' },
  reviewBadge: { backgroundColor: '#FFF2D9' },
  statusText: { fontSize: 10, fontFamily: 'Montserrat_600SemiBold', color: '#10200F' },
  locationText: { fontSize: 11, fontFamily: 'Montserrat_400Regular', color: '#7B8177', marginTop: 1 },
  dateText: { fontSize: 11, fontFamily: 'Montserrat_400Regular', color: '#9CA3AF', marginTop: 1 },
  reportFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  healthRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  healthIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  healthText: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold' },
  actionSeparator: {
    height: 1,
    backgroundColor: '#E8ECDD',
    marginVertical: 8,
  },
  actionButton: { alignSelf: 'flex-end' },
  actionText: { fontSize: 12, fontFamily: 'Montserrat_700Bold', color: '#3DAA2B' },
})
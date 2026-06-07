import React, { useEffect, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AdminBottomNav from './AdminBottomNav'

const { height } = Dimensions.get('window')

export default function AdminMap() {
  const router = useRouter()

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
              height: 100%;
              margin: 0;
              padding: 0;
          }

          .leaflet-container {
            background: #f3f7ef;
          }

          .custom-marker {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ef4444;
          }
      </style>
  </head>

  <body>
      <div id="map"></div>

      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

      <script>

          var map = L.map('map', {
            zoomControl: true,
            minZoom: 12,
            maxZoom: 18,
            attributionControl: false
          }).setView([11.0519, 124.0055], 14);

          L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: ''
            }
          ).addTo(map);

          var unhealthyAreas = [
            [11.0600,124.0100],
            [11.0450,124.0010],
            [11.0555,124.0150]
          ];

          var redIcon = L.divIcon({
            className: '',
            html: '<div class="custom-marker"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          unhealthyAreas.forEach(function(coords) {
            L.marker(coords, { icon: redIcon })
             .addTo(map)
             .bindPopup('<b>Unhealthy Mangrove Area</b>');
          });

      </script>
  </body>
  </html>
  `

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Map</Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-backward"
              size={20}
              color="#10200F"
            />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapBox}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            scalesPageToFit
          />
        </View>

        {/* Legend */}
        <View style={styles.legendCard}>
          <View style={styles.legendRow}>
            <View style={styles.redDot} />
            <Text style={styles.legendText}>
              Unhealthy Mangrove Area
            </Text>
          </View>

          <Text style={styles.legendSubtext}>
            Showing reported unhealthy mangrove locations in Bogo City.
          </Text>
        </View>
      </Animated.View>

      <AdminBottomNav activeTab="map" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
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

  mapBox: {
    height: height * 0.60,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8ECDD',
    backgroundColor: '#fff',

    shadowColor: '#A7B195',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  legendCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    padding: 14,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginRight: 10,
  },

  legendText: {
    fontSize: 14,
    color: '#10200F',
    fontFamily: 'Montserrat_600SemiBold',
  },

  legendSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    fontFamily: 'Montserrat_400Regular',
  },
})
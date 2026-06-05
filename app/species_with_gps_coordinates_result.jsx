import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'

export default function SpeciesWithGpsCoordinatesResult() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })

  if (!fontsLoaded) return null

  const readableLocation = [
    params.barangay,
    params.city,
    params.region,
  ].filter(Boolean).join(', ')

  const formattedDate = params.timestamp
    ? new Date(params.timestamp).toLocaleString()
    : 'Unknown Date'

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Captured Image */}
        <View style={styles.imageCard}>
          {params.imageUri ? (
            <Image source={{ uri: params.imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Species Info */}
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI SPECIES IDENTIFICATION</Text>
          </View>

          <Text style={styles.speciesName}>{params.speciesName || ''}</Text>

          <Text style={styles.description}>{params.description || ''}</Text>

          <Text style={styles.disclaimer}>
            Species identification will appear here once the AI model is implemented.
          </Text>
        </View>

        {/* Location & GPS */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeaderRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={20} color="#6daa1a" />
            </View>
            <View style={styles.locationTextColumn}>
              <Text style={styles.locationLabel}>LOCATION</Text>
              <Text style={styles.locationTitle}>{readableLocation || 'Detecting Location...'}</Text>
              <Text style={styles.locationSub}>{params.country || 'Unknown Region'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="navigate-circle" size={20} color="#6daa1a" />
            <View style={styles.textContainer}>
              <Text style={styles.miniLabel}>GPS COORDINATES</Text>
              <Text style={styles.infoText}>{params.latitude || '0.000000'}, {params.longitude || '0.000000'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#6daa1a" />
            <View style={styles.textContainer}>
              <Text style={styles.miniLabel}>CAPTURE TIMESTAMP</Text>
              <Text style={styles.infoText}>{formattedDate}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Header Overlay (exactly like camera.jsx) */}
      <SafeAreaView style={styles.headerOverlay} pointerEvents="box-none">
        <View style={styles.topOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Fixed Action Button Dock */}
      <View style={styles.buttonDock}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
          <Ionicons name="heart-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Check Health Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FBFCF7' 
  },
  
  content: { 
    padding: 16, 
    paddingBottom: 30 ,
    paddingTop: 24,
  },

  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  topOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 35,
    backgroundColor: 'transparent',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(21, 30, 28, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imageCard: { 
    borderRadius: 22, 
    overflow: 'hidden', 
    backgroundColor: '#FFFFFF', 
    marginBottom: 16 
  },
  
  image: { 
    width: '100%', 
    height: 260 
  },
  
  imagePlaceholder: { 
    height: 260, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F3F4F6' 
  },

  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 18, 
    marginBottom: 16 
  },

  badge: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#CFEFC7', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12, 
    marginBottom: 12 
  },

  badgeText: { 
    fontSize: 11, 
    color: '#2E8F2C', 
    fontFamily: 'Montserrat_700Bold' 
  },
  
  speciesName: { 
    fontSize: 30, 
    lineHeight: 38, 
    color: '#10200F', 
    fontFamily: 'Montserrat_700Bold',
     marginBottom: 10 
    },

  description: { 
    fontSize: 16, 
    lineHeight: 28, 
    color: '#4B5563', 
    fontFamily: 'Montserrat_400Regular' 
  },

  disclaimer: { 
    marginTop: 20, 
    fontSize: 13, 
    lineHeight: 20, 
    color: '#9CA3AF', 
    fontStyle: 'italic' 
  },

  locationCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    shadowColor: '#A7B195',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },

  locationHeaderRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 4,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  locationTextColumn: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#6daa1a',
    letterSpacing: 1,
    marginBottom: 2,
  },

  locationTitle: { 
    fontSize: 16, 
    color: '#10200F', 
    fontFamily: 'Montserrat_600SemiBold' 
  },

  locationSub: { 
    fontSize: 12, 
    color: '#6B7280', 
    fontFamily: 'Montserrat_400Regular' 
  },

  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },

  textContainer: {
    flex: 1,
  },

  miniLabel: {
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 1,
  },

  infoText: { 
    fontSize: 14, 
    color: '#4B5563', 
    fontFamily: 'Montserrat_400Regular' 
  },

  divider: { 
    height: 1, 
    backgroundColor: '#E5E7EB', 
    marginVertical: 14 
  },
  
  buttonDock: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 35,
  },
  
  primaryButton: { 
    height: 60, 
    borderRadius: 16, 
    backgroundColor: '#6daa1a', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row' 
  },

  primaryButtonText: { 
    marginLeft: 8, 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontFamily: 'Montserrat_700Bold' },
})
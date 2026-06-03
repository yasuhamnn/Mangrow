import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'

function formatValue(value) {
  if (!value) {
    return 'N/A'
  }

  return Array.isArray(value) ? value.join(', ') : String(value)
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{formatValue(value)}</Text>
    </View>
  )
}

export default function SpeciesWithGpsCoordinatesResult() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="location" size={30} color="#2F7D32" />
          </View>

          <Text style={styles.title}>Geo-tagged capture saved</Text>
          <Text style={styles.subtitle}>
            Use these coordinates and address details for debugging and field verification.
          </Text>

          <View style={styles.detailsCard}>
            <DetailRow label="Latitude" value={params.latitude} />
            <DetailRow label="Longitude" value={params.longitude} />
            <DetailRow label="Timestamp" value={params.timestamp} />
            <DetailRow label="Street" value={params.street} />
            <DetailRow label="Purok" value={params.purok} />
            <DetailRow label="Barangay" value={params.barangay} />
            <DetailRow label="City / Municipality" value={params.city} />
            <DetailRow label="District" value={params.district} />
            <DetailRow label="Province / Region" value={params.region} />
            <DetailRow label="Country" value={params.country} />
            <DetailRow label="Formatted Address" value={params.formattedAddress} />
          </View>

          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back to Camera</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7EF',
  },
  content: {
    flexGrow: 1,
    padding: 18,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#151515',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 0,
    elevation: 4,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#151515',
    backgroundColor: '#DDF0C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: 'Montserrat_700Bold',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Montserrat_400Regular',
    color: '#374151',
  },
  detailsCard: {
    backgroundColor: '#FBFCF7',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#151515',
    padding: 14,
  },
  detailRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D7E2CE',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#2F3B2C',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Montserrat_400Regular',
    color: '#111827',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#6daa1a',
    borderWidth: 2,
    borderColor: '#151515',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 0,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
})

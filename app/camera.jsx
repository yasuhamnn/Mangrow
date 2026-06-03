import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'

function mapLocationDetails(address) {
  return {
    street: address?.street || null,
    purok: address?.name || null,
    barangay: address?.subregion || address?.district || null,
    city: address?.city || address?.subregion || null,
    district: address?.district || null,
    region: address?.region || null,
    country: address?.country || null,
    postalCode: address?.postalCode || null,
    formattedAddress: [
      address?.street,
      address?.name,
      address?.district,
      address?.subregion,
      address?.city,
      address?.region,
      address?.country,
    ]
      .filter(Boolean)
      .join(', '),
  }
}

const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions()
  const [locationPermission, setLocationPermission] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const cameraRef = useRef(null)
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(status === 'granted')
    })()
  }, [])

  if (!fontsLoaded || !permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6daa1a" />
      </View>
    )
  }

  if (!permission.granted || locationPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need camera and location permissions to geo-tag mangrove photos.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            await requestPermission()
            const { status } = await Location.requestForegroundPermissionsAsync()
            setLocationPermission(status === 'granted')
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return

    try {
      setIsCapturing(true)

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const { latitude, longitude } = location.coords
      const timestamp = new Date().toISOString()

      const photo = await cameraRef.current.takePictureAsync({
        exif: true,
        quality: 0.8,
      })

      let locationDetails = {
        street: null,
        purok: null,
        barangay: null,
        city: null,
        district: null,
        region: null,
        country: null,
        postalCode: null,
        formattedAddress: '',
      }

      try {
        const [address = {}] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        })

        locationDetails = mapLocationDetails(address)
      } catch (reverseGeocodeError) {
        console.warn('Reverse geocoding failed:', reverseGeocodeError)
      }

      console.log('Captured Geo-Tagged Image:', {
        uri: photo.uri,
        lat: latitude,
        lng: longitude,
        timestamp,
        ...locationDetails,
      })

      router.push({
        pathname: '/species_with_gps_coordinates_result',
        params: {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          timestamp,
          street: locationDetails.street,
          purok: locationDetails.purok,
          barangay: locationDetails.barangay,
          city: locationDetails.city,
          district: locationDetails.district,
          region: locationDetails.region,
          country: locationDetails.country,
          postalCode: locationDetails.postalCode,
          formattedAddress: locationDetails.formattedAddress,
        },
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to capture geo-tagged image.')
      console.error(error)
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <SafeAreaView style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Mangrove Capture</Text>
            <View style={styles.iconButtonSpacer} />
          </View>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.captureInner} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  )
}

export default CameraScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFCF7',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cameraTitle: {
    color: '#fff',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonSpacer: {
    width: 44,
  },
  bottomBar: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  captureContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6daa1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  message: {
    textAlign: 'center',
    fontFamily: 'Montserrat_400Regular',
    color: '#374151',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#6daa1a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
  },
})

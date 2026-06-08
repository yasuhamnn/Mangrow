import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'

function mapLocationDetails(address) {
  return {
    street: address?.street || null,
    purok: address?.name && address?.name !== address?.street ? address?.name : null,
    barangay: address?.district || null,
    city: address?.city || null,
    province: address?.subregion || null,
    region: address?.region || null,
    country: address?.country || null,
    postalCode: address?.postalCode || null,
    formattedAddress: [
      address?.name !== address?.street ? address?.name : null,
      address?.street,
      address?.district,
      address?.subregion,
      address?.city,
      address?.region,
      address?.country,
    ].filter(Boolean).join(', '),
  }
}

export default function HealthCamera() {
  const [permission, requestPermission] = useCameraPermissions()
  const [locationPermission, setLocationPermission] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [flash, setFlash] = useState('off')
  const [coords, setCoords] = useState(null)
  const cameraRef = useRef(null)
  const router = useRouter()
  const params = useLocalSearchParams()

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })

  useEffect(() => {
    let subscription
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      const granted = status === 'granted'
      setLocationPermission(granted)

      if (granted) {
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 3000, distanceInterval: 5 },
          (location) => setCoords(location.coords)
        )
      }
    })()
    return () => subscription && subscription.remove()
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
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          We need camera and location permissions to capture leaf photos.
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
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      const { latitude, longitude } = location.coords
      const timestamp = new Date().toISOString()

      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, exif: true })

      let locationDetails = { formattedAddress: '' }
      try {
        const [address = {}] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        })
        locationDetails = mapLocationDetails(address)
      } catch (reverseGeocodeError) {
        console.warn('Reverse geocoding failed:', reverseGeocodeError)
      }

      router.push({
        pathname: '/health_results',
        params: {
          ...params,
          imageUri: photo.uri,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          timestamp,
          ...locationDetails,
        },
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to capture leaf photo.')
      console.error(error)
    } finally {
      setIsCapturing(false)
    }
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery access is required.')
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      })
      if (!result.canceled) {
        router.push({
          pathname: '/health_results',
          params: {
            ...params,
            imageUri: result.assets[0].uri,
            timestamp: new Date().toISOString(),
          },
        })
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image.')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.previewPane}>
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          flash={flash}
        />

        <SafeAreaView style={styles.previewOverlay} pointerEvents="box-none">
          <View style={styles.topOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.statusPill}>
              <Ionicons name="location-sharp" size={14} color="#55D230" />
              <Text style={styles.statusText}>
                {coords ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}` : 'Detecting GPS...'}
              </Text>
            </View>
            <View style={styles.topButtonSpacer} />
          </View>

          <View style={styles.guideLayer} pointerEvents="none">
            <View style={styles.frameGuide}>
              <Text style={styles.frameText}>Align leaves on the box</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.controlDock}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage} activeOpacity={0.85}>
            <Ionicons name="image-outline" size={23} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isCapturing}
            activeOpacity={0.86}
          >
            <View style={styles.captureInner}>
              {isCapturing ? <ActivityIndicator color="#fff" /> : <Ionicons name="camera-outline" size={24} color="#fff" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flashButton}
            onPress={() => setFlash(prev => (prev === 'off' ? 'on' : 'off'))}
            activeOpacity={0.85}
          >
            <Ionicons name={flash === 'on' ? 'flash' : 'flash-off-outline'} size={23} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.dockHint}>GPS & timestamp are embedded automatically.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  previewPane: { flex: 1, minHeight: 340, overflow: 'hidden', backgroundColor: '#111' },
  camera: { ...StyleSheet.absoluteFillObject },
  previewOverlay: { ...StyleSheet.absoluteFillObject },
  topOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 35,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 15,
    backgroundColor: 'rgba(31, 38, 34, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  topButtonSpacer: { 
    width: 34, 
    height: 34 
  },

  statusPill: { 
    minWidth: 198, 
    height: 34, 
    borderRadius: 15, 
    paddingHorizontal: 13, 
    backgroundColor: 'rgba(31,38,34,0.82)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 5, borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.16)' 
  },

  statusText: { 
    color: '#fff', 
    fontFamily: 'Montserrat_700Bold', 
    fontSize: 12 
  },

  guideLayer: { 
    ...StyleSheet.absoluteFillObject, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 28, 
    paddingBottom: 12
   },

  frameGuide: {
    width: '95%',
    height: '50%',
    aspectRatio: 1,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  frameText: {
    color: '#fff',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  controlDock: {
    height: 186,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 28,
  },
  controlRow: {
    width: 230,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureButtonDisabled: { 
    opacity: 0.7 
  },

  captureInner: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#3EAA2B', 
    justifyContent: 'center', 
    alignItems: 'center'
   },

  dockHint: {
    marginTop: 18,
    color: '#B8C7E7',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  permissionContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 28, 
    backgroundColor: '#000' 
  },

  permissionButton: { 
    backgroundColor: '#6daa1a', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 24, 
    marginTop: 16 
  },

  permissionButtonText: { 
    color: '#fff', 
    fontFamily: 'Montserrat_700Bold' 
  },

  message: { 
    color: '#fff', 
    fontFamily: 'Montserrat_400Regular', 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 20 
  },
})
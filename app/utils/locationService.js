// import * as Location from 'expo-location'

// export const getCurrentLocation = async () => {
//   const { status } =
//     await Location.requestForegroundPermissionsAsync()

//   if (status !== 'granted') {
//     throw new Error('Location permission denied')
//   }

//   const location = await Location.getCurrentPositionAsync({
//     accuracy: Location.Accuracy.High,
//   })

//   const [address = {}] = await Location.reverseGeocodeAsync({
//     latitude: location.coords.latitude,
//     longitude: location.coords.longitude,
//   })

//   return {
//     latitude: location.coords.latitude,
//     longitude: location.coords.longitude,
//     areaName: address.name || null,
//     street: address.street || null,
//     district: address.district || null,
//     barangay: address.subregion || address.district || null,
//     city: address.city || address.subregion || null,
//     region: address.region || null,
//     country: address.country || null,
//     postalCode: address.postalCode || null,
//     formattedAddress: [
//       address.name,
//       address.street,
//       address.district,
//       address.subregion,
//       address.city,
//       address.region,
//       address.country,
//     ]
//       .filter(Boolean)
//       .join(', '),
//   }
// }

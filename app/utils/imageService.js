// import * as MediaLibrary from 'expo-media-library'

// export const savePhotoWithMetadata = async (
//   uri,
//   metadata
// ) => {
//   const { status } =
//     await MediaLibrary.requestPermissionsAsync()

//   if (status !== 'granted') {
//     throw new Error('Media library permission denied')
//   }

//   const asset = await MediaLibrary.createAssetAsync(uri)

//   console.log('Saved Metadata:', metadata)

//   return asset
// }
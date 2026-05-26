import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Dashboard for Admin
      </Text>
    </View>
  )
}

export default AdminDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})
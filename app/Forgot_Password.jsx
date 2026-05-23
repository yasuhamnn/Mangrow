import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'

const { width } = Dimensions.get('window')

const Forgot_Password = () => {
  return (
    <LinearGradient
      colors={['#7FD4FF', '#B4F3D8', '#77E8C5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/app_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Recover Your Account</Text>
      <Text style={styles.subtitle}>
        Enter your email and we’ll send a password reset link.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Reset Link →</Text>
        </TouchableOpacity>

        <Link href="/Sign_In" asChild>
          <TouchableOpacity style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </LinearGradient>
  )
}

export default Forgot_Password

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },

  logoContainer: {
    marginTop: 40,
    marginBottom: -20,
  },

  logo: {
    width: 110,
    height: 110,
  },

  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: -10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: width * 0.035,
    color: '#6B7280',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    color: '#374151',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },

  button: {
    backgroundColor: '#0F766E',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  backLink: {
    alignItems: 'center',
    marginTop: 16,
  },

  backLinkText: {
    color: '#0F766E',
    fontWeight: '600',
  },
})

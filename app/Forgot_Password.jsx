import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const { width } = Dimensions.get('window')

const Forgot_Password = () => {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleResetPassword = async () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setErrorMessage('Enter the email address for your account.')
      return
    }

    setErrorMessage('')
    setIsSending(true)

    try {
      await sendPasswordResetEmail(auth, trimmedEmail)
      Alert.alert(
        'Check your inbox',
        'If an account exists for that email, a password reset link has been sent.'
      )
      setEmail('')
    } catch (error) {
      if (error?.code === 'auth/invalid-email') {
        setErrorMessage('Enter a valid email address.')
      } else {
        setErrorMessage(
          error?.message ?? 'Unable to send the reset email right now.'
        )
      }
    } finally {
      setIsSending(false)
    }
  }

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
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isSending && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isSending}
        >
          <Text style={styles.buttonText}>
            {isSending ? 'Sending...' : 'Send Reset Link →'}
          </Text>
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

  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#0F766E',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
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
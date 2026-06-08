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
import { Link } from 'expo-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'
import AuthBackground from './components/AuthBackground'
import LoadingOverlay from './components/LoadingOverlay'

const { width } = Dimensions.get('window')

const Forgot_Password = () => {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

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
      } else if (error?.code === 'auth/user-not-found') {
        setErrorMessage('No account exists with this email.')
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
    <AuthBackground style={styles.container}>
      <LoadingOverlay visible={isSending} />

      <Text style={styles.title}>Welcome to Mangrow</Text>
      <Text style={styles.subtitle}>
        Monitor mangroves, protect coastlines
      </Text>

      <View style={styles.card}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#7A8593"
          value={email}
          onChangeText={setEmail}
        />

        {/* Inline prompt + link matching UI used on Sign In / Create Account */}
        <View style={styles.inlinePrompt}>
          <Text style={styles.bottomPromptText}>Remember your password?</Text>
          <Link href="/Sign_In" asChild>
            <TouchableOpacity>
              <Text style={styles.backLinkText}> Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity
          style={[styles.button, isSending && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isSending}
        >
          <Text style={styles.buttonText}>
            {isSending ? 'Sending...' : 'Send Link →'}
          </Text>
        </TouchableOpacity>

      </View>
    </AuthBackground>
  )
}

export default Forgot_Password

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.69)',
  },
  title: {
    fontSize: width * 0.06,
    fontFamily: 'Montserrat_700Bold',
    color: '#111827',
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
    opacity: 0.95,
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Montserrat_600SemiBold',
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },

  inlinePrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },

  bottomPromptText: {
    color: '#374151',
    fontSize: 14,
  },

  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#6daa1a',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },

  backLink: {
    alignItems: 'center',
    marginTop: 30,
  },

  backLinkText: {
    color: '#437105',
    fontSize: 14,
    fontWeight: '700',
  },
})

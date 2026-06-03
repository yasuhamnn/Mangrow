import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { loginOffline } from '../offlineAuth'
import { isOnline } from '../network'
import { db } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'
import AuthBackground from './components/AuthBackground'

const { width } = Dimensions.get('window')


const Sign_In = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  })
  
  if (!fontsLoaded) {
    return null
  }
  

  const handleLogin = async () => {
    setErrorMessage('')
  
    const online = await isOnline()
  
    try {
      if (online) {
        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email.trim(),
            password
          )
  
        const uid = userCredential.user.uid
  
        // GET USER ROLE FROM FIRESTORE
        const userDoc = await getDoc(
          doc(db, 'users', uid)
        )
  
        if (!userDoc.exists()) {
          setErrorMessage('User record not found.')
          return
        }
  
        const userData = userDoc.data()
  
        // ROLE-BASED REDIRECT
        if (userData.role === 'admin') {
          router.replace('/admin/admin_dashboard')
        } else {
          router.replace('/dashboard')
        }
  
      } else {
        // OFFLINE LOGIN (DEFAULT VOLUNTEER ACCESS)
        await loginOffline(email.trim(), password)
  
        router.replace('/dashboard')
      }
  
    } catch (error) {
      const authErrorCodes = [
        'auth/invalid-credential',
        'auth/wrong-password',
        'auth/user-not-found',
        'auth/invalid-email',
      ]
  
      const offlineAuthErrors = [
        'Invalid offline credentials',
      ]
  
      if (
        authErrorCodes.includes(error?.code) ||
        offlineAuthErrors.includes(error?.message)
      ) {
        setErrorMessage('Incorrect email or password.')
      } else {
        setErrorMessage(error?.message ?? 'Unable to sign in.')
      }
    }
  }
  return (
    <AuthBackground style={styles.container}>
      <Text style={styles.title}>Welcome to Mangrow</Text>
      <Text style={styles.subtitle}>Monitor mangroves, protect coastlines</Text>

      <View style={styles.card}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeText}>Sign In</Text>
          </TouchableOpacity>

          <Link href="/Create_Account" asChild>
            <TouchableOpacity style={styles.inactiveTab}>
              <Text style={styles.inactiveText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          style={[styles.input, emailFocused && styles.inputFocused]}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#7A8593"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          onChangeText={setEmail}
          value={email}
        />

        <Text style={styles.label}>Password</Text>

        <View
          style={[
            styles.passwordContainer,
            passwordFocused && styles.inputFocused,
          ]}
        >
          <TextInput
            placeholder="Enter your password"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            placeholderTextColor="#7A8593"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <Link href="/Forgot_Password" asChild>
          <TouchableOpacity style={styles.forgotLink}>
            <Text style={styles.forgotLinkText}>Forgot password?</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.bottomPrompt}>
          <Text style={styles.bottomPromptText}>Don't have an account? </Text>
          
          <Link href="/Create_Account" asChild>
            <TouchableOpacity>
              <Text style={styles.bottomPromptLink}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In →</Text>
        </TouchableOpacity>
      </View>
    </AuthBackground>
  )
}

export default Sign_In

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

  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#6B7280',
    marginBottom: 10,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    paddingBottom: 28,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },

  activeTab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  inactiveTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  activeText: {
    fontFamily: 'Montserrat_700Bold',
    color: '#111827',
  },

  inactiveText: {
    color: '#6B7280',
    fontFamily: 'Montserrat_600SemiBold',

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

  inputFocused: {
    borderColor: '#6daa1a',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 10,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },

  forgotLink: {
    alignItems: 'center',
    marginTop: 8,
  },

  forgotLinkText: {
    color: '#437105',
    
    fontWeight: '700',
  },

  bottomPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  bottomPromptText: {
    color: '#374151',
    fontSize: 14,
  },

  bottomPromptLink: {
    color: '#437105',
    fontSize: 14,
    fontWeight: '700',
  },

  button: {
    backgroundColor: '#6daa1a',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
})

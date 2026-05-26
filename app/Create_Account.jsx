import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { saveUserOffline } from '../offlineAuth'
import { isOnline } from '../network'
import { db } from '../firebaseConfig'
import { doc, setDoc, serverTimestamp,} from 'firebase/firestore'

const { width } = Dimensions.get('window')

const Create_Account = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullNameFocused, setFullNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const router = useRouter()


  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert('Missing information', 'Please fill in all fields.')
      return
    }
  
    const online = await isOnline()
  
    try {
      if (online) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )
  
        await updateProfile(credential.user, {
          displayName: fullName.trim(),
        })
  
        // SAVE USER TO FIRESTORE
        await setDoc(doc(db, 'users', credential.user.uid), {
          uid: credential.user.uid,
          fullName: fullName.trim(),
          email: email.trim(),
          role: 'volunteer', // DEFAULT ROLE
          createdAt: serverTimestamp(),
        })
  
        Alert.alert('Success', 'Account created successfully.')
  
        router.push('/Sign_In')
      } else {
        await saveUserOffline(email.trim(), password, fullName.trim())
  
        Alert.alert(
          'Offline',
          'Saved offline. Will sync later.'
        )
      }
    } catch (error) {
      Alert.alert('Error', error.message)
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

      <Text style={styles.title}>Welcome to Mangrow</Text>
      <Text style={styles.subtitle}>Monitor mangroves, protect coastlines</Text>

      <View style={styles.card}>
        <View style={styles.tabContainer}>
          <Link href="/Sign_In" asChild>
            <TouchableOpacity style={styles.inactiveTab}>
              <Text style={styles.inactiveText}>Sign In</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.activeTab}>
            <Text style={styles.activeText}>Create Account</Text>
          </View>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="John Doe"
          style={[styles.input, fullNameFocused && styles.inputFocused]}
          placeholderTextColor="#7A8593"
          value={fullName}
          onChangeText={setFullName}
          onFocus={() => setFullNameFocused(true)}
          onBlur={() => setFullNameFocused(false)}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          style={[styles.input, emailFocused && styles.inputFocused]}
          keyboardType="email-address"
          placeholderTextColor="#7A8593"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
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
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.topPrompt}>
          <Text style={styles.topPromptText}>Already have an account? </Text>
          <Link href="/Sign_In" asChild>
            <TouchableOpacity>
              <Text style={styles.topPromptLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account →</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

export default Create_Account

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
  },

  subtitle: {
    fontSize: width * 0.035,
    color: '#6B7280',
    marginBottom: 10,
  },

  topPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },

  topPromptText: {
    color: '#374151',
    fontSize: 14,
  },

  topPromptLink: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    fontWeight: 'bold',
    color: '#111827',
  },

  inactiveText: {
    color: '#6B7280',
    fontWeight: '600',
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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
    borderColor: '#0F766E',
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

  button: {
    backgroundColor: '#0F766E',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 16,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
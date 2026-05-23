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
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'

const { width } = Dimensions.get('window')

const Sign_In = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

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
      <Text style={styles.subtitle}>
      Monitor mangroves, protect coastlines
      </Text>

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

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          style={[styles.input, emailFocused && styles.inputFocused]}
          keyboardType="email-address"
          placeholderTextColor="#7A8593"
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

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In →</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

export default Sign_In

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

  card: {
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
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

  forgotLink: {
    alignItems: 'center',
    marginTop: 8,
  },

  forgotLinkText: {
    color: '#0F766E',
    fontWeight: '600',
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
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '700',
  },

  button: {
    backgroundColor: '#0F766E',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

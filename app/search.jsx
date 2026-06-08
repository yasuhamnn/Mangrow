import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function Search() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(10)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const recentSearches = [
    'Rhizophora apiculata', 
    'Manila Bay North', 
    'Cavite Coastline', 
    'Unhealthy Areas'
  ]

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.main, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Search Header Area */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#10200F" />
          </TouchableOpacity>
          
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#7B8177" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search species or location..."
              placeholderTextColor="#7B8177"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#7B8177" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Recent Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.listCard}>
              {recentSearches.map((item, index) => (
                <TouchableOpacity key={index} style={styles.listItem} activeOpacity={0.6}>
                  <View style={styles.itemLeft}>
                    <Feather name="clock" size={16} color="#9CA3AF" />
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                  <Feather name="arrow-up-left" size={18} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Filter Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggestions</Text>
            <View style={styles.chipContainer}>
              {['Endangered', 'High Risk', 'Coastal Parks', 'Palawan', 'Bohol'].map((label) => (
                <TouchableOpacity key={label} style={styles.chip}>
                  <Text style={styles.chipText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFCF7' },
  main: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 16, gap: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    shadowColor: '#A7B195',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#10200F', padding: 0 },
  content: { paddingHorizontal: 14, paddingBottom: 40 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontFamily: 'Montserrat_700Bold', color: '#6E756A', letterSpacing: 1, textTransform: 'uppercase', marginLeft: 4 },
  clearText: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#34A232' },
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E8ECDD', overflow: 'hidden' },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F5ED' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemText: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#374151' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECDD',
  },
  chipText: { fontSize: 13, fontFamily: 'Montserrat_600SemiBold', color: '#437105' },
})
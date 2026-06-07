import React, { useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AdminBottomNav from './AdminBottomNav'

export default function AdminNotification() {
  const router = useRouter()
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

  const notifications = [
    {
      id: '1',
      title: 'New Report Submitted',
      description:
        'A new mangrove health report was submitted and requires verification.',
      time: '5 min ago',
      type: 'new_report',
      isRead: false,
    },
    {
      id: '2',
      title: 'Resolution Submitted',
      description:
        'A volunteer submitted a resolution update for an unhealthy mangrove area.',
      time: '1h ago',
      type: 'resolution',
      isRead: false,
    },
    {
      id: '3',
      title: 'Report Approved',
      description:
        'A previously reviewed report has been approved.',
      time: '4h ago',
      type: 'approved',
      isRead: true,
    },
  ]

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'new_report':
        return {
          icon: 'document-text',
          bg: '#DDF3D6',
          color: '#2DA031',
        }

      case 'resolution':
        return {
          icon: 'checkmark-done-circle',
          bg: '#DDF3D6',
          color: '#2DA031',
        }

      case 'approved':
        return {
          icon: 'checkmark-circle',
          bg: '#DDF3D6',
          color: '#2DA031',
        }

      case 'rejected':
        return {
          icon: 'close-circle',
          bg: '#FFE7E7',
          color: '#FF4D4F',
        }

      case 'alert':
        return {
          icon: 'warning',
          bg: '#FFF2D9',
          color: '#C98A00',
        }

      default:
        return {
          icon: 'notifications',
          bg: '#EFF5E8',
          color: '#6DAA1A',
        }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#10200F"
              />
            </TouchableOpacity>
          </View>

          {/* Notification List */}
          {notifications.map((item) => {
            const status = getNotificationStyle(item.type)

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={[
                  styles.notificationCard,
                  !item.isRead && styles.unreadCard,
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: status.bg,
                    },
                  ]}
                >
                  <Ionicons
                    name={status.icon}
                    size={22}
                    color={status.color}
                  />
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <View style={styles.titleRow}>
                      {!item.isRead && (
                        <View style={styles.unreadDot} />
                      )}

                      <Text style={styles.cardTitle}>
                        {item.title}
                      </Text>
                    </View>

                    <Text style={styles.timeText}>
                      {item.time}
                    </Text>
                  </View>

                  <Text style={styles.cardDescription}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </Animated.View>

      <AdminBottomNav activeTab="alert" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFCF7',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  title: {
    fontSize: 22,
    color: '#10200F',
    fontFamily: 'Montserrat_700Bold',
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: '#EFF5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8ECDD',
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },

  unreadCard: {
    backgroundColor: '#F7FCF2',
    borderColor: '#DDF3D6',
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6DAA1A',
    marginRight: 6,
  },

  cardTitle: {
    fontSize: 14,
    color: '#10200F',
    fontFamily: 'Montserrat_700Bold',
  },

  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat_400Regular',
  },

  cardDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
  },
})
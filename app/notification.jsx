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
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import BottomNav from './components/BottomNav'

export default function Notification() {
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
            title: 'Report Approved',
            description:
                'Your mangrove report has been verified by the administrator.',
            time: '2h ago',
            type: 'approved',
            isRead: false,
        },
        {
            id: '2',
            title: 'Under Review',
            description:
                'Your submitted report is currently under review.',
            time: '1d ago',
            type: 'review',
            isRead: true,
        },
        {
            id: '3',
            title: 'Resolved',
            description:
                'Your submitted report has been resolved.',
            time: '3d ago',
            type: 'resolved',
            isRead: true,
        },
    ]

    const getIcon = (type) => {
        switch (type) {
            case 'approved':
                return {
                    icon: 'checkmark-circle',
                    bg: '#DDF3D6',
                    color: '#2DA031',
                }

            case 'review':
                return {
                    icon: 'time',
                    bg: '#FFF2D9',
                    color: '#C98A00',
                }

            default:
                return {
                    icon: 'leaf',
                    bg: '#DDF3D6',
                    color: '#6daa1a',
                }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}

                <View style={styles.header}>
                    <Text style={styles.title}>Notification</Text>

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

                {/* Notification Cards */}

                {notifications.map((item) => {
                    const status = getIcon(item.type)

                    return (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.85}
                            style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
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
                                        {!item.isRead && <View style={styles.unreadDot} />}
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

            <BottomNav activeTab="alert" />
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

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    unreadDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#6daa1a',
        marginRight: 6,
    },

    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
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

    bottomNav: {
        position: 'absolute',
        bottom: 17,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 0,
    },

    bottomNavSafeArea: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 14,
        backgroundColor: '#fff',
    },

    navItem: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 38,
    },

    navIconWrap: {
        width: 22,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navText: {
        marginTop: 1,
        fontSize: 8,
        fontFamily: 'Montserrat_400Regular',
        lineHeight: 10,
        color: '#8E958A',
    },

    activeNavText: {
        color: '#3D5F18',
    },

    cameraWrapper: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        marginTop: -20,
    },

    cameraBackground: {
        width: 60,
        height: 60,
        borderRadius: 29,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cameraButton: {
        width: 46,
        height: 46,
        borderRadius: 22,
        backgroundColor: '#3EAA2B',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

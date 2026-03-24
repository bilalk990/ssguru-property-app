import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    StatusBar,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import Colors from '../../constants/colors';
import { getMe } from '../../api/authApi';
import { applyForFranchise } from '../../api/franchiseApi';
import { getPropertiesByAgent } from '../../api/propertyApi';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [propertyCount, setPropertyCount] = useState(0);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const storedUser = await AsyncStorage.getItem('userData');
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const userId = parsedUser?.id || parsedUser?._id;

            if (userId) {
                const response = await getMe(userId);
                const data = response.data?.data || response.data?.user || response.data;
                setUser(data);
                if (data) await AsyncStorage.setItem('userData', JSON.stringify(data));

                // Fetch property count for agents
                if (data?.role === 'agent' || data?.role === 'admin') {
                    try {
                        const propertiesRes = await getPropertiesByAgent(userId);
                        const properties = propertiesRes.data?.data || propertiesRes.data || [];
                        setPropertyCount(Array.isArray(properties) ? properties.length : 0);
                    } catch (err) {
                        console.error('Property count fetch error:', err);
                        setPropertyCount(0);
                    }
                }
            } else {
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('Profile Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleApply = async () => {
        Alert.alert(
            "Franchise Application",
            "Submit your franchise application?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Apply",
                    onPress: async () => {
                        try {
                            const userDataStr = await AsyncStorage.getItem('userData');
                            const userData = userDataStr ? JSON.parse(userDataStr) : {};
                            await applyForFranchise({
                                name: userData.name || 'Interested Partner',
                                phone: userData.contact || userData.phone || '',
                                message: "Applying for a new franchise branch."
                            });
                            Alert.alert("Success", "Your franchise application has been submitted!");
                        } catch (e) {
                            Alert.alert("Error", "Failed to submit application.");
                        }
                    }
                }
            ]
        );
    };

    if (loading && !user) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const userData = user || {};

    const menuItems = [
        ...(userData.role === 'admin' ? [{
            icon: 'bar-chart-outline',
            title: 'Admin Dashboard',
            subtitle: 'Platform analytics & stats',
            onPress: () => navigation.navigate('AdminDashboard'),
        }] : []),
        ...(userData.role === 'franchise' ? [{
            icon: 'grid-outline',
            title: 'Franchise Dashboard',
            subtitle: 'Success tracking',
            onPress: () => navigation.navigate('FranchiseDashboard'),
        }] : []),
        ...(userData.role === 'admin' ? [
            {
                icon: 'location-outline',
                title: 'Location Manager',
                subtitle: 'Districts & Areas',
                onPress: () => navigation.navigate('LocationManager'),
            },
            {
                icon: 'videocam-outline',
                title: 'Live Tour Manager',
                subtitle: 'Control stream status',
                onPress: () => navigation.navigate('StreamManager'),
            }
        ] : []),
        {
            icon: 'business-outline',
            title: 'My Properties',
            subtitle: `${propertyCount} listings`,
            onPress: () => navigation.navigate('MyProperties'),
        },
        ...((userData.role === 'admin' || userData.role === 'agent') ? [{
            icon: 'flash-outline',
            title: 'Leads Manager',
            subtitle: 'Enquiries & Requirements',
            onPress: () => navigation.navigate('Leads'),
        }] : []),
        {
            icon: 'add-circle-outline',
            title: 'Post Requirement',
            subtitle: 'Tell us what you need',
            onPress: () => navigation.navigate('PostRequirement'),
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            subtitle: 'Alerts & updates',
            onPress: () => navigation.navigate('Notification'),
        },
        {
            icon: 'shield-checkmark-outline',
            title: 'Support & Legal',
            subtitle: 'Help, Terms & Privacy',
            onPress: () => navigation.navigate('AboutContact'),
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} barStyle="light-content" translucent={false} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <Image
                            source={{ uri: userData.avatar || 'https://i.pravatar.cc/150' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.userName}>{userData.name || 'Guest User'}</Text>
                        <Text style={styles.userPhone}>{userData.email || userData.phone || 'No contact info'}</Text>
                        <TouchableOpacity
                            style={styles.editProfileBtn}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Icon name="pencil" size={14} color={Colors.textWhite} />
                        </TouchableOpacity>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{propertyCount}</Text>
                            <Text style={styles.statLabel}>Listed</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{userData.enquiriesMade || 0}</Text>
                            <Text style={styles.statLabel}>Enquiries</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Icon name="star" size={20} color="#FFD700" />
                            <Text style={styles.statLabel}>{userData.role === 'agent' ? 'Expert' : 'Premium'}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation.navigate('AddProperty')}>
                        <View style={[styles.quickIconBox, { backgroundColor: Colors.primarySoft }]}>
                            <Icon name="add-circle-outline" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.quickText}>Add{'\n'}Property</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation.navigate('Agents')}>
                        <View style={[styles.quickIconBox, { backgroundColor: '#E8F5E9' }]}>
                            <Icon name="people-outline" size={24} color="#2E7D32" />
                        </View>
                        <Text style={styles.quickText}>Meet{'\n'}Agents</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation.navigate('Gallery')}>
                        <View style={[styles.quickIconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Icon name="images-outline" size={24} color="#1565C0" />
                        </View>
                        <Text style={styles.quickText}>View{'\n'}Gallery</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                            activeOpacity={0.7}>
                            <View style={styles.menuLeft}>
                                <View style={styles.menuIconWrapper}>
                                    <Icon name={item.icon} size={22} color={Colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.menuTitle}>{item.title}</Text>
                                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                            <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={async () => {
                    Alert.alert(
                        'Logout',
                        'Are you sure you want to logout?',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Logout',
                                style: 'destructive',
                                onPress: async () => {
                                    await AsyncStorage.clear();
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'Login' }],
                                        })
                                    );
                                }
                            }
                        ]
                    );
                }}>
                    <Icon name="log-out-outline" size={20} color={Colors.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.versionText}>SS Property Guru v1.0.0</Text>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
    },
    // Header
    header: {
        backgroundColor: Colors.primary,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: 12,
        backgroundColor: Colors.primaryLight,
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.textWhite,
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 8,
    },
    editProfileBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 6,
        borderRadius: 10,
        marginTop: 5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textWhite,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: -4,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    quickAction: {
        alignItems: 'center',
        gap: 8,
    },
    quickIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    quickEmoji: {
        fontSize: 24,
    },
    quickText: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontWeight: '600',
        textAlign: 'center',
    },
    // Menu
    menuSection: {
        marginTop: 24,
        marginHorizontal: 16,
        backgroundColor: Colors.backgroundCard,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    menuIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: Colors.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    menuSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    menuArrow: {
        fontSize: 24,
        color: Colors.textLight,
    },
    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 20,
        paddingVertical: 16,
        backgroundColor: '#FFEBEE',
        borderRadius: 14,
        gap: 8,
    },
    logoutIcon: {
        fontSize: 18,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.error,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 16,
    },
});

export default ProfileScreen;

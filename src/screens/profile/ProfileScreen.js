import React from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import Colors from '../../constants/colors';
import { dummyUser } from '../../constants/dummyData';

const ProfileScreen = ({ navigation }) => {
    const user = dummyUser;

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.clear();
                    // Reset to root-level Splash screen
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Splash' }],
                        }),
                    );
                },
            },
        ]);
    };

    const menuItems = [
        {
            icon: 'business-outline',
            title: 'My Properties',
            subtitle: `${user.propertiesListed} listings`,
            onPress: () => navigation.navigate('MyProperties'),
        },
        {
            icon: 'chatbubbles-outline',
            title: 'My Enquiries',
            subtitle: `${user.enquiriesMade} enquiries`,
            onPress: () => { },
        },
        {
            icon: 'card-outline',
            title: 'Payment History',
            subtitle: 'View transactions',
            onPress: () => { },
        },
        {
            icon: 'notifications-outline',
            title: 'Notifications',
            subtitle: 'Manage alerts',
            onPress: () => { },
        },
        {
            icon: 'settings-outline',
            title: 'Settings',
            subtitle: 'App preferences',
            onPress: () => { },
        },
        {
            icon: 'call-outline',
            title: 'Contact Us',
            subtitle: 'Get help & support',
            onPress: () => { },
        },
        {
            icon: 'information-circle-outline',
            title: 'About',
            subtitle: 'App info & version',
            onPress: () => { },
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userPhone}>{user.phone}</Text>
                        <Text style={styles.memberSince}>
                            Member since {user.memberSince}
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user.propertiesListed}</Text>
                            <Text style={styles.statLabel}>Listed</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user.enquiriesMade}</Text>
                            <Text style={styles.statLabel}>Enquiries</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Icon name="star" size={20} color="#FFD700" />
                            <Text style={styles.statLabel}>Premium</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation.navigate('AddProperty')}>
                        <View
                            style={[
                                styles.quickIconBox,
                                { backgroundColor: Colors.primarySoft },
                            ]}>
                            <Text style={styles.quickEmoji}>➕</Text>
                        </View>
                        <Text style={styles.quickText}>Add{'\n'}Property</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation.navigate('MyProperties')}>
                        <View
                            style={[
                                styles.quickIconBox,
                                { backgroundColor: Colors.accentSoft },
                            ]}>
                            <Text style={styles.quickEmoji}>📋</Text>
                        </View>
                        <Text style={styles.quickText}>My{'\n'}Listings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => navigation.navigate('Enquiry')}>
                        <View
                            style={[styles.quickIconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Text style={styles.quickEmoji}>📝</Text>
                        </View>
                        <Text style={styles.quickText}>Submit{'\n'}Enquiry</Text>
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
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
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

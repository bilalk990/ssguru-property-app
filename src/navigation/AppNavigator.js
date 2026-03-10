import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../constants/colors';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import BuyPropertyScreen from '../screens/property/BuyPropertyScreen';
import PropertyDetailScreen from '../screens/property/PropertyDetailScreen';
import AddPropertyScreen from '../screens/property/AddPropertyScreen';
import MyPropertiesScreen from '../screens/property/MyPropertiesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EnquiryFormScreen from '../screens/home/EnquiryFormScreen';

const Tab = createBottomTabNavigator();

// Create SEPARATE stack instances for each tab to avoid route name conflicts
const HomeStackNav = createNativeStackNavigator();
const BuyStackNav = createNativeStackNavigator();
const SellStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

// Tab icon component
const TabIcon = ({ label, emoji, focused }) => (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
        <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
            {emoji}
        </Text>
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
            {label}
        </Text>
    </View>
);

// Home Stack
const HomeStack = () => (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
        <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
        <HomeStackNav.Screen name="PropertyDetail" component={PropertyDetailScreen} />
        <HomeStackNav.Screen name="Enquiry" component={EnquiryFormScreen} />
        <HomeStackNav.Screen name="MyProperties" component={MyPropertiesScreen} />
        <HomeStackNav.Screen name="AddProperty" component={AddPropertyScreen} />
    </HomeStackNav.Navigator>
);

// Buy Stack
const BuyStack = () => (
    <BuyStackNav.Navigator screenOptions={{ headerShown: false }}>
        <BuyStackNav.Screen name="BuyMain" component={BuyPropertyScreen} />
        <BuyStackNav.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </BuyStackNav.Navigator>
);

// Sell Stack
const SellStack = () => (
    <SellStackNav.Navigator screenOptions={{ headerShown: false }}>
        <SellStackNav.Screen name="AddPropertyMain" component={AddPropertyScreen} />
    </SellStackNav.Navigator>
);

// Profile Stack
const ProfileStack = () => (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
        <ProfileStackNav.Screen name="MyProperties" component={MyPropertiesScreen} />
        <ProfileStackNav.Screen name="AddProperty" component={AddPropertyScreen} />
        <ProfileStackNav.Screen name="Enquiry" component={EnquiryFormScreen} />
        <ProfileStackNav.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </ProfileStackNav.Navigator>
);

// Bottom Tabs
const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}>
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="Home" emoji="🏠" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="BuyTab"
                component={BuyStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="Buy" emoji="🔍" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="SellTab"
                component={SellStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="Sell" emoji="💰" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="Profile" emoji="👤" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: Platform.OS === 'ios' ? 88 : 68,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    tabItemActive: {
        backgroundColor: Colors.primarySoft,
    },
    tabEmoji: {
        fontSize: 22,
        marginBottom: 2,
        opacity: 0.5,
    },
    tabEmojiActive: {
        opacity: 1,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: Colors.textLight,
    },
    tabLabelActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
});

export default AppNavigator;

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

// ... existing screens imports ...
import HomeScreen from '../screens/home/HomeScreen';
import BuyPropertyScreen from '../screens/property/BuyPropertyScreen';
import PropertyDetailScreen from '../screens/property/PropertyDetailScreen';
import AddPropertyScreen from '../screens/property/AddPropertyScreen';
import MyPropertiesScreen from '../screens/property/MyPropertiesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EnquiryFormScreen from '../screens/home/EnquiryFormScreen';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Create SEPARATE stack instances
const HomeStackNav = createNativeStackNavigator();
const BuyStackNav = createNativeStackNavigator();
const SellStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

// Tab icon component
const TabIcon = ({ label, icon, focused }) => {
    const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
    const bgOpacityAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: focused ? 1 : 0.95,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(bgOpacityAnim, {
                toValue: focused ? 1 : 0,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start();
    }, [focused, scaleAnim, bgOpacityAnim]);

    return (
        <Animated.View style={[
            styles.tabItemContainer,
            { transform: [{ scale: scaleAnim }] }
        ]}>
            <Icon
                name={focused ? icon : `${icon}-outline`}
                size={24}
                color={focused ? Colors.primary : Colors.textLight}
            />
            <Text style={[
                styles.tabLabel,
                focused && styles.tabLabelActive
            ]}>
                {label}
            </Text>
        </Animated.View>
    );
};

// ... existing stack components ...
const HomeStack = () => (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
        <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
        <HomeStackNav.Screen name="PropertyDetail" component={PropertyDetailScreen} />
        <HomeStackNav.Screen name="Enquiry" component={EnquiryFormScreen} />
        <HomeStackNav.Screen name="MyProperties" component={MyPropertiesScreen} />
        <HomeStackNav.Screen name="AddProperty" component={AddPropertyScreen} />
    </HomeStackNav.Navigator>
);

const BuyStack = () => (
    <BuyStackNav.Navigator screenOptions={{ headerShown: false }}>
        <BuyStackNav.Screen name="BuyMain" component={BuyPropertyScreen} />
        <BuyStackNav.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </BuyStackNav.Navigator>
);

const SellStack = () => (
    <SellStackNav.Navigator screenOptions={{ headerShown: false }}>
        <SellStackNav.Screen name="AddPropertyMain" component={AddPropertyScreen} />
    </SellStackNav.Navigator>
);

const ProfileStack = () => (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
        <ProfileStackNav.Screen name="MyProperties" component={MyPropertiesScreen} />
        <ProfileStackNav.Screen name="AddProperty" component={AddPropertyScreen} />
        <ProfileStackNav.Screen name="Enquiry" component={EnquiryFormScreen} />
        <ProfileStackNav.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </ProfileStackNav.Navigator>
);

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Bottom Tabs
const AppNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? '';
                const hideTabs = [
                    'PropertyDetail',
                    'Enquiry',
                    'AddProperty',
                    'MyProperties',
                    'AddPropertyMain',
                    'EnquiryForm'
                ].includes(routeName);

                return {
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: [
                        hideTabs ? { display: 'none' } : styles.tabBar,
                        { height: Platform.OS === 'ios' ? 88 : 65 }
                    ],
                };
            }}>
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="Home" icon="home" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="BuyTab"
                component={BuyStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="Explore" icon="search" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="SellTab"
                component={SellStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="List" icon="add-circle" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon label="You" icon="person" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        flexDirection: 'row',
    },
    tabItemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: Colors.textLight,
        marginTop: 4,
    },
    tabLabelActive: {
        fontWeight: '700',
        color: Colors.primary,
    },
});


export default AppNavigator;

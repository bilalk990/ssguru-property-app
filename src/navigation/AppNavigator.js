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
            <Animated.View style={[
                styles.activePill,
                { opacity: bgOpacityAnim }
            ]} />
            <Icon
                name={focused ? icon : `${icon}-outline`}
                size={22}
                color={focused ? Colors.primary : Colors.textLight}
            />
            {focused && (
                <Text style={styles.tabLabelActive}>{label}</Text>
            )}
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
                        { height: 65 + (Platform.OS === 'ios' ? insets.bottom : 10) }
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        flexDirection: 'row',
        paddingHorizontal: 12,
    },
    tabItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 24,
        alignSelf: 'center',
    },
    activePill: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(46, 125, 50, 0.08)',
        borderRadius: 24,
    },
    tabLabelActive: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
        marginLeft: 10,
    },
});


export default AppNavigator;

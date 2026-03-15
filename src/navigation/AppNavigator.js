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
import AgentsScreen from '../screens/agent/AgentsScreen';
import GalleryScreen from '../screens/corporate/GalleryScreen';
import FranchiseScreen from '../screens/corporate/FranchiseScreen';
import AboutContactScreen from '../screens/corporate/AboutContactScreen';
import EnquiryFormScreen from '../screens/home/EnquiryFormScreen';
import LiveTourScreen from '../screens/home/LiveTourScreen';
import PostRequirementScreen from '../screens/home/PostRequirementScreen';
import AdminDashboardScreen from '../screens/profile/AdminDashboardScreen';
import NotificationScreen from '../screens/profile/NotificationScreen';
import ManagementListScreen from '../screens/profile/ManagementListScreen';
import LeadsScreen from '../screens/agent/LeadsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import LocationManagerScreen from '../screens/profile/LocationManagerScreen';
import StreamManagerScreen from '../screens/profile/StreamManagerScreen';
import FranchiseDashboardScreen from '../screens/profile/FranchiseDashboardScreen';

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
        <HomeStackNav.Screen name="Agents" component={AgentsScreen} />
        <HomeStackNav.Screen name="Gallery" component={GalleryScreen} />
        <HomeStackNav.Screen name="Franchise" component={FranchiseScreen} />
        <HomeStackNav.Screen name="AboutContact" component={AboutContactScreen} />
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
        <ProfileStackNav.Screen name="Agents" component={AgentsScreen} />
        <ProfileStackNav.Screen name="Gallery" component={GalleryScreen} />
        <ProfileStackNav.Screen name="Franchise" component={FranchiseScreen} />
        <ProfileStackNav.Screen name="AboutContact" component={AboutContactScreen} />
    </ProfileStackNav.Navigator>
);

const Stack = createNativeStackNavigator(); // Define Stack navigator

// Bottom Tabs
const AppNavigator = () => {
    const insets = useSafeAreaInsets();

    const MainTabNavigator = () => (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Projects') iconName = focused ? 'search' : 'search-outline'; // Changed from business to search for explore
                    else if (route.name === 'Sell') iconName = focused ? 'add-circle' : 'add-circle-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    return <Icon name={iconName} size={24} color={color} />;
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textLight,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 5 },
                tabBarStyle: {
                    height: 65 + insets.bottom,
                    backgroundColor: Colors.background,
                    borderTopWidth: 1,
                    borderTopColor: Colors.border,
                    paddingTop: 10,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
                    elevation: 0,
                    shadowOpacity: 0,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Projects" component={BuyPropertyScreen} />
            <Tab.Screen name="Sell" component={AddPropertyScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
            <Stack.Screen name="Enquiry" component={EnquiryFormScreen} />
            <Stack.Screen name="MyProperties" component={MyPropertiesScreen} />
            <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
            <Stack.Screen name="Agents" component={AgentsScreen} />
            <Stack.Screen name="Gallery" component={GalleryScreen} />
            <Stack.Screen name="Franchise" component={FranchiseScreen} />
            <Stack.Screen name="AboutContact" component={AboutContactScreen} />
            <Stack.Screen name="LiveTour" component={LiveTourScreen} />
            <Stack.Screen name="PostRequirement" component={PostRequirementScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="ManagementList" component={ManagementListScreen} />
            <Stack.Screen name="Leads" component={LeadsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="LocationManager" component={LocationManagerScreen} />
            <Stack.Screen name="StreamManager" component={StreamManagerScreen} />
            <Stack.Screen name="FranchiseDashboard" component={FranchiseDashboardScreen} />
        </Stack.Navigator>
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

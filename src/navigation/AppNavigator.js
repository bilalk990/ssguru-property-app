import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
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
    const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.5)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: focused ? 1.1 : 1,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: focused ? 1 : 0.6,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start();
    }, [focused, scaleAnim, opacityAnim]);

    return (
        <Animated.View style={[
            styles.tabItem,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
        ]}>
            <Icon
                name={focused ? icon : `${icon}-outline`}
                size={22}
                color={focused ? Colors.primary : Colors.textLight}
            />
            {focused && (
                <Text style={styles.tabLabelActive}>{label}</Text>
            )}
            {focused && <View style={styles.activeIndicator} />}
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

// Bottom Tabs
const AppNavigator = () => {
    return (
        <View style={styles.tabBarWrapper}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    tabBarWrapper: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 24 : 16,
        left: 20,
        right: 20,
        height: 68,
        borderRadius: 24,
        backgroundColor: 'transparent',
        // This makes sure the tab bar floats
    },
    tabBar: {
        position: 'absolute',
        height: 68,
        backgroundColor: Colors.background,
        borderRadius: 24,
        borderTopWidth: 0,
        elevation: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: (width - 40) / 4,
        paddingTop: 4,
    },
    tabLabelActive: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: 2,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.primary,
    },
});


export default AppNavigator;

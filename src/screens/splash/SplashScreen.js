import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, StatusBar, Dimensions, Animated } from 'react-native';
import Colors from '../../constants/colors';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo bounce animation
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Progress bar animation
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false, // width animation does not support native driver
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Login'); // Replace with your actual next screen
        }, 2500);

        return () => clearTimeout(timer);
    }, [navigation, scaleAnim, opacityAnim, progressAnim]);

    // Interpolate progress value to width percentage
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
            <Animated.View style={[
                styles.logoContainer,
                { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
            ]}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            <View style={styles.bottomBar}>
                <View style={styles.loadingBar}>
                    <Animated.View style={[styles.loadingProgress, { width: progressWidth }]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.55,
        height: width * 0.55,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        alignItems: 'center',
    },
    loadingBar: {
        width: 120,
        height: 4,
        backgroundColor: Colors.borderLight,
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingProgress: {
        width: '60%',
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
});

export default SplashScreen;

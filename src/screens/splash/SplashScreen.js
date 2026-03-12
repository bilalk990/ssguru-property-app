import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, StatusBar, Dimensions, Animated, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const scaleAnim = useRef(new Animated.Value(0.6)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Immersive animations
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 15,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Progress bar fills up
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation, scaleAnim, opacityAnim, progressAnim]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <LinearGradient
                colors={['#1B5E20', '#0A1F0D']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>

                <Animated.View style={[
                    styles.logoWrapper,
                    { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
                ]}>
                    <View style={styles.logoCircle}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </Animated.View>

                <View style={styles.footer}>
                    <Text style={styles.versionLabel}>Premium Experience v1.0</Text>
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingTrack}>
                            <Animated.View style={[styles.loadingFill, { width: progressWidth }]} />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

// Simple text component for version label in splash
const Text = ({ children, style }) => (
    <Animated.Text style={style}>{children}</Animated.Text>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoCircle: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logo: {
        width: '100%',
        height: '100%',
        tintColor: '#FFFFFF', // Optional: Make logo white for dark splash
    },
    footer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 60 : 40,
        width: '100%',
        alignItems: 'center',
    },
    versionLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    loadingContainer: {
        width: 140,
        height: 3,
    },
    loadingTrack: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingFill: {
        height: '100%',
        backgroundColor: Colors.accentMuted,
        borderRadius: 2,
    },
});

export default SplashScreen;


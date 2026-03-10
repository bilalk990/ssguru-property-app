import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import Colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.backgroundDark} barStyle="light-content" />
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.bottomBar}>
                <View style={styles.loadingBar}>
                    <View style={styles.loadingProgress} />
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

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Dimensions,
} from 'react-native';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { sendOtp } from '../../api/authApi';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (phone.length < 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
            return;
        }

        setLoading(true);
        try {
            await sendOtp(phone);
            navigation.navigate('OTP', { phone });
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {/* Top decoration */}
                <View style={styles.topDecoration}>
                    <View style={styles.decorCircle1} />
                    <View style={styles.decorCircle2} />
                </View>

                {/* Logo */}
                <View style={styles.logoSection}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Welcome Text */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Sign in to explore properties & list your own
                    </Text>
                </View>

                {/* Phone Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={styles.phoneInputContainer}>
                        <View style={styles.countryCode}>
                            <Text style={styles.flag}>🇮🇳</Text>
                            <Text style={styles.codeText}>+91</Text>
                        </View>
                        <View style={styles.divider} />
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="Enter your phone number"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    <CustomButton
                        title="Send OTP"
                        onPress={handleSendOTP}
                        loading={loading}
                        size="large"
                        style={styles.otpButton}
                        icon="📱"
                    />
                </View>

                {/* Terms */}
                <Text style={styles.termsText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.linkText}>Terms of Service</Text> &{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    topDecoration: {
        position: 'absolute',
        top: -80,
        right: -60,
    },
    decorCircle1: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: Colors.primarySoft,
        opacity: 0.5,
    },
    decorCircle2: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.accentSoft,
        opacity: 0.4,
        position: 'absolute',
        top: 100,
        left: -40,
    },
    logoSection: {
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 20,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    welcomeTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    inputSection: {
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 10,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.border,
        paddingHorizontal: 16,
        height: 58,
        marginBottom: 20,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    flag: {
        fontSize: 20,
    },
    codeText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    divider: {
        width: 1.5,
        height: 28,
        backgroundColor: Colors.border,
        marginHorizontal: 14,
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        letterSpacing: 1,
    },
    otpButton: {
        marginTop: 4,
    },
    termsText: {
        fontSize: 12,
        color: Colors.textLight,
        textAlign: 'center',
        lineHeight: 18,
    },
    linkText: {
        color: Colors.primary,
        fontWeight: '600',
    },
});

export default LoginScreen;

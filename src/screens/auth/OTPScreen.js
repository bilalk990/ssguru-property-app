import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { verifyOtp } from '../../api/authApi';

const OTP_LENGTH = 4;

const OTPScreen = ({ route, navigation }) => {
    const { phone } = route.params;
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length < OTP_LENGTH) {
            Alert.alert('Invalid OTP', 'Please enter the complete OTP.');
            return;
        }

        setLoading(true);
        try {
            const response = await verifyOtp(phone, otpString);
            const { token, user } = response.data;

            // Store token and user data
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));
            await AsyncStorage.setItem('isLoggedIn', 'true');

            // Navigate to main app
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp' }],
            });
        } catch (error) {
            Alert.alert(
                'Verification Failed',
                error?.response?.data?.message || 'Invalid OTP. Please try again.',
            );
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setTimer(30);
        Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.emoji}>🔐</Text>
                    <Text style={styles.title}>Verify Phone</Text>
                    <Text style={styles.subtitle}>
                        Enter the 4-digit code sent to{'\n'}
                        <Text style={styles.phoneText}>+91 {phone}</Text>
                    </Text>
                </View>

                {/* OTP Inputs */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => (inputRefs.current[index] = ref)}
                            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                            value={digit}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            autoFocus={index === 0}
                            selectionColor={Colors.primary}
                        />
                    ))}
                </View>

                {/* Hint for dummy */}
                <View style={styles.hintBox}>
                    <Text style={styles.hintText}>💡 Use OTP: 1234 for testing</Text>
                </View>

                {/* Verify Button */}
                <CustomButton
                    title="Verify & Continue"
                    onPress={handleVerify}
                    loading={loading}
                    size="large"
                    style={styles.verifyButton}
                    icon="✓"
                />

                {/* Resend */}
                <View style={styles.resendSection}>
                    {timer > 0 ? (
                        <Text style={styles.timerText}>
                            Resend OTP in <Text style={styles.timerBold}>{timer}s</Text>
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    backIcon: {
        fontSize: 22,
        color: Colors.textPrimary,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 50,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    phoneText: {
        color: Colors.primary,
        fontWeight: '700',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 20,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: Colors.backgroundSecondary,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    otpInputFilled: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primarySoft,
    },
    hintBox: {
        alignSelf: 'center',
        backgroundColor: Colors.accentSoft,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 30,
    },
    hintText: {
        fontSize: 13,
        color: Colors.accent,
        fontWeight: '600',
    },
    verifyButton: {
        marginBottom: 24,
    },
    resendSection: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    timerBold: {
        fontWeight: '700',
        color: Colors.primary,
    },
    resendText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
    },
});

export default OTPScreen;

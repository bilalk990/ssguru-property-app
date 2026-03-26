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
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { forgotPassword } from '../../api/authApi';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!phone || phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
            return;
        }

        setLoading(true);
        try {
            const response = await forgotPassword(phone);
            const devOtp = response.data?.data?.devOtp;
            navigation.navigate('OTP', {
                email: phone,
                mode: 'verify',
                prefillOtp: devOtp || null,
            });
            if (devOtp) {
                setTimeout(() => {
                    Alert.alert('Dev Mode OTP', `Your OTP: ${devOtp}`);
                }, 500);
            }
        } catch (error) {
            console.error('[LOGIN] Error:', error.response?.data);
            const msg = error.response?.data?.message || 'Failed to send OTP. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">

                {/* Modern Decorative Background */}
                <View style={styles.topDecoration}>
                    <LinearGradient
                        colors={[Colors.primarySoft, Colors.background]}
                        style={styles.decorCircle}
                    />
                    <LinearGradient
                        colors={[Colors.accentSoft, Colors.background]}
                        style={styles.decorCircleSmall}
                    />
                </View>

                {/* Header Content */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Enter your phone number to login</Text>
                </View>


                {/* Input Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="call-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter 10-digit number"
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
                        style={styles.button}
                        icon="log-in-outline"
                    />

                    <View style={styles.signupContainer}>
                        <Text style={styles.noAccountText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By signing in, you agree to our{' '}
                        <Text style={styles.link}>Terms</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>
                    </Text>
                </View>
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
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
    },
    topDecoration: {
        position: 'absolute',
        top: -100,
        right: -100,
        zIndex: -1,
    },
    decorCircle: {
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.6,
    },
    decorCircleSmall: {
        width: 150,
        height: 150,
        borderRadius: 75,
        position: 'absolute',
        bottom: 50,
        left: -50,
        opacity: 0.4,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        padding: 20,
        backgroundColor: Colors.surface,
        elevation: 10,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 28,
        padding: 24,
        elevation: 4,
        shadowColor: Colors.shadowDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 24,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceSecondary,
        borderRadius: 18,
        height: 64,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    inputIcon: {
        marginRight: 12,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    forgotBtn: {
        alignSelf: 'trailing',
        marginBottom: 25,
        marginTop: -10,
    },
    forgotText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        marginTop: 10,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    noAccountText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    signupLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    footer: {
        marginTop: 40,
        marginBottom: 40,
        paddingHorizontal: 40,
    },
    footerText: {
        fontSize: 12,
        color: Colors.textLight,
        textAlign: 'center',
        lineHeight: 18,
    },
    link: {
        color: Colors.primary,
        fontWeight: '700',
    },
    // Role Styles
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 25,
    },
    roleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 20,
        backgroundColor: Colors.surfaceSecondary,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    roleChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    roleText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    roleTextActive: {
        color: Colors.textWhite,
    },
});

export default LoginScreen;


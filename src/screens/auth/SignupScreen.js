import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { signup } from '../../api/authApi';

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        const trimmedName = (name || '').trim();
        const trimmedPhone = (phone || '').trim();

        if (!trimmedName || !trimmedPhone) {
            Alert.alert('Missing Fields', 'Please enter your name and phone number.');
            return;
        }

        if (trimmedPhone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid phone number (at least 10 digits).');
            return;
        }

        setLoading(true);
        try {
            const requestData = {
                name: trimmedName,
                contact: trimmedPhone,
            };

            const response = await signup(requestData);

            if (response.data) {
                const devOtp = response.data?.data?.devOtp;
                Alert.alert(
                    'Account Created',
                    devOtp
                        ? `OTP (dev): ${devOtp}`
                        : 'Please verify your phone number with the OTP sent.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('OTP', {
                                email: trimmedPhone,
                                mode: 'verify',
                                prefillOtp: devOtp,
                            }),
                        },
                    ]
                );
            }
        } catch (error) {
            console.error('Signup Error:', error.response?.data);
            let message = 'Failed to create account. Please try again.';

            if (error.response?.status === 409) {
                message = 'This phone number is already registered. Please login.';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.code === 'ERR_NETWORK') {
                message = 'Cannot connect to server. Check your internet connection.';
            }

            Alert.alert('Signup Error', message);
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

                <View style={styles.topDecoration}>
                    <LinearGradient
                        colors={[Colors.primarySoft, Colors.background]}
                        style={styles.decorCircle}
                    />
                </View>

                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Enter your details to get started</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="person-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Your full name"
                            placeholderTextColor={Colors.textLight}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="call-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="10-digit number"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    <CustomButton
                        title="Create Account"
                        onPress={handleSignup}
                        loading={loading}
                        size="large"
                        style={styles.button}
                    />

                    <View style={styles.loginContainer}>
                        <Text style={styles.alreadyAccountText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By signing up, you agree to our{' '}
                        <Text style={styles.link}>Terms</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60 },
    topDecoration: { position: 'absolute', top: -150, right: -150, zIndex: -1 },
    decorCircle: { width: 400, height: 400, borderRadius: 200, opacity: 0.5 },
    header: { marginBottom: 40 },
    title: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 6 },
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
        fontSize: 13, fontWeight: '700', color: Colors.textPrimary,
        marginBottom: 10, marginLeft: 4, textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.surfaceSecondary,
        borderRadius: 18, height: 60, paddingHorizontal: 16, marginBottom: 20,
    },
    inputIcon: { marginRight: 12 },
    countryCode: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginRight: 8 },
    input: { flex: 1, fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
    button: { marginTop: 10 },
    loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
    alreadyAccountText: { color: Colors.textSecondary, fontSize: 14 },
    loginLink: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
    footer: { marginTop: 40, marginBottom: 40 },
    footerText: { fontSize: 12, color: Colors.textLight, textAlign: 'center', lineHeight: 18 },
    link: { color: Colors.primary, fontWeight: '700' },
});

export default SignupScreen;

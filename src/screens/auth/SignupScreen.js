import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, StatusBar, KeyboardAvoidingView,
    Platform, ScrollView, Alert, TouchableOpacity, Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/colors';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import AnimatedButton from '../../components/AnimatedButton';
import { signup } from '../../api/authApi';

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    // Staggered Animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const headerSlide = useRef(new Animated.Value(-30)).current;
    const nameAnim = useRef(new Animated.Value(0)).current;
    const nameSlide = useRef(new Animated.Value(20)).current;
    const emailAnim = useRef(new Animated.Value(0)).current;
    const emailSlide = useRef(new Animated.Value(20)).current;
    const phoneAnim = useRef(new Animated.Value(0)).current;
    const phoneSlide = useRef(new Animated.Value(20)).current;
    const btnAnim = useRef(new Animated.Value(0)).current;
    const btnSlide = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.stagger(100, [
            Animated.parallel([
                Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(headerSlide, { toValue: 0, tension: 20, friction: 6, useNativeDriver: true })
            ]),
            Animated.parallel([
                Animated.timing(nameAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(nameSlide, { toValue: 0, tension: 30, friction: 7, useNativeDriver: true })
            ]),
            Animated.parallel([
                Animated.timing(emailAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(emailSlide, { toValue: 0, tension: 30, friction: 7, useNativeDriver: true })
            ]),
            Animated.parallel([
                Animated.timing(phoneAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(phoneSlide, { toValue: 0, tension: 30, friction: 7, useNativeDriver: true })
            ]),
            Animated.parallel([
                Animated.timing(btnAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(btnSlide, { toValue: 0, tension: 30, friction: 7, useNativeDriver: true })
            ]),
        ]).start();
    }, []);

    const handleSignup = async () => {
        const trimmedName = (name || '').trim();
        const trimmedEmail = (email || '').trim();
        const trimmedPhone = (phone || '').trim();

        if (!trimmedName || !trimmedEmail || !trimmedPhone) {
            return Alert.alert('Missing Fields', 'Please fill in your name, email, and phone number.');
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(trimmedEmail)) {
            return Alert.alert('Invalid Email', 'Please enter a valid email address.');
        }

        if (trimmedPhone.length < 10) {
            return Alert.alert('Invalid Phone', 'Please enter a valid 10-digit number.');
        }

        setLoading(true);
        try {
            const response = await signup({ name: trimmedName, email: trimmedEmail, contact: trimmedPhone });
            if (response.data) {
                const devOtp = response.data?.data?.devOtp;
                navigation.navigate('OTP', { email: trimmedPhone, mode: 'verify', prefillOtp: devOtp || null });
                if (devOtp) setTimeout(() => Alert.alert('Dev Mode OTP', `Your OTP: ${devOtp}`), 500);
            }
        } catch (error) {
            console.error('Signup Error:', error.response?.data);
            let message = 'Failed to create account. Please try again.';
            if (error.response?.status === 409) message = 'This phone or email is already registered. Please login.';
            else if (error.response?.data?.message) message = error.response.data.message;
            Alert.alert('Signup Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                <View style={styles.topDecoration}>
                    <LinearGradient colors={[Colors.primarySoft, Colors.background]} style={styles.decorCircle} />
                </View>

                <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerSlide }] }]}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Enter your details to get started</Text>
                </Animated.View>

                <View style={styles.card}>
                    <Animated.View style={{ opacity: nameAnim, transform: [{ translateY: nameSlide }] }}>
                        <FloatingLabelInput
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            icon="person-outline"
                            style={{ marginBottom: 20 }}
                        />
                    </Animated.View>

                    <Animated.View style={{ opacity: emailAnim, transform: [{ translateY: emailSlide }] }}>
                        <FloatingLabelInput
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            icon="mail-outline"
                            keyboardType="email-address"
                            style={{ marginBottom: 20 }}
                        />
                    </Animated.View>

                    <Animated.View style={{ opacity: phoneAnim, transform: [{ translateY: phoneSlide }] }}>
                        <FloatingLabelInput
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            icon="call-outline"
                            prefix="+91"
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={{ marginBottom: 28 }}
                        />
                    </Animated.View>

                    <Animated.View style={{ opacity: btnAnim, transform: [{ translateY: btnSlide }] }}>
                        <AnimatedButton
                            title="Create Account"
                            onPress={handleSignup}
                            loading={loading}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.alreadyAccountText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>

                <Animated.View style={[styles.footer, { opacity: btnAnim }]}>
                    <Text style={styles.footerText}>
                        By signing up, you agree to our{' '}
                        <Text style={styles.link}>Terms</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>
                    </Text>
                </Animated.View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60 },
    topDecoration: { position: 'absolute', top: -150, right: -150, zIndex: -1 },
    decorCircle: { width: 400, height: 400, borderRadius: 200, opacity: 0.5 },
    header: { marginBottom: 30, marginTop: 20 },
    title: { fontSize: 34, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 6, fontWeight: '500' },
    card: {
        backgroundColor: Colors.surface, borderRadius: 32, padding: 28, elevation: 6,
        shadowColor: Colors.shadowPremium, shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1, shadowRadius: 32, borderWidth: 1, borderColor: Colors.borderLight,
        paddingBottom: 24,
    },
    loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    alreadyAccountText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '500' },
    loginLink: { color: Colors.primary, fontSize: 14, fontWeight: '800' },
    footer: { marginTop: 30, marginBottom: 40, paddingHorizontal: 20 },
    footerText: { fontSize: 12, color: Colors.textLight, textAlign: 'center', lineHeight: 18 },
    link: { color: Colors.primary, fontWeight: '700' },
});

export default SignupScreen;

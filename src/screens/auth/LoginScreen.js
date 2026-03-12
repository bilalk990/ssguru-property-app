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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
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
                    <Text style={styles.subtitle}>Enter your details to manage your properties</Text>
                </View>

                {/* Input Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <View style={styles.prefix}>
                            <Icon name="call" size={18} color={Colors.primary} />
                            <Text style={styles.prefixText}>+91</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <TextInput
                            style={styles.input}
                            placeholder="000 000 0000"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    <CustomButton
                        title="Continue"
                        onPress={handleSendOTP}
                        loading={loading}
                        size="large"
                        style={styles.button}
                        icon="arrow-forward"
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By proceeding, you agree to our{' '}
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
    prefix: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    prefixText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: Colors.border,
        marginHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 17,
        color: Colors.textPrimary,
        fontWeight: '600',
        letterSpacing: 1,
    },
    button: {
        marginTop: 10,
    },
    footer: {
        marginTop: 'auto',
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
});

export default LoginScreen;


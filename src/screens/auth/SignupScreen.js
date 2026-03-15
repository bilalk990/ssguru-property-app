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
import { launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { signup } from '../../api/authApi';

const { width } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Map to 'user' or 'agent'
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handlePickImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setAvatar(response.assets[0]);
            }
        });
    };

    const handleSignup = async () => {
        if (!name || !phone || !email || !password) {
            Alert.alert('Fields Required', 'Please fill in all mandatory fields.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);

            if (avatar) {
                formData.append('avatar', {
                    uri: Platform.OS === 'android' ? avatar.uri : avatar.uri.replace('file://', ''),
                    type: avatar.type,
                    name: avatar.fileName || `avatar_${Date.now()}.jpg`,
                });
            }

            const response = await signup(formData);
            if (response.data) {
                Alert.alert('Success', 'Account created! Please check your email for OTP verification.', [
                    { text: 'OK', onPress: () => navigation.navigate('OTP', { email, mode: 'verify' }) }
                ]);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create account. Please try again.';
            Alert.alert('Error', message);
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

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Join SS Guru</Text>
                    <Text style={styles.subtitle}>Start your elite property journey today</Text>
                </View>

                {/* Avatar Picker */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
                        {avatar ? (
                            <Image source={{ uri: avatar.uri }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Icon name="camera-outline" size={32} color={Colors.primary} />
                                <Text style={styles.avatarText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Role Selection */}
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[styles.roleChip, role === 'user' && styles.roleChipActive]}
                        onPress={() => setRole('user')}
                    >
                        <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>I'm a Buyer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleChip, role === 'agent' && styles.roleChipActive]}
                        onPress={() => setRole('agent')}
                    >
                        <Text style={[styles.roleText, role === 'agent' && styles.roleTextActive]}>I'm an Agent</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="person-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor={Colors.textLight}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="call-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="+92 300 0000000"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="mail-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="yourname@gmail.com"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="lock-closed-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={Colors.textLight}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textLight} />
                        </TouchableOpacity>
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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
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
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    topDecoration: {
        position: 'absolute',
        top: -150,
        right: -150,
        zIndex: -1,
    },
    decorCircle: {
        width: 400,
        height: 400,
        borderRadius: 200,
        opacity: 0.5,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 5,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.surfaceSecondary,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 25,
    },
    roleChip: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: Colors.surfaceSecondary,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    roleChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    roleTextActive: {
        color: Colors.textWhite,
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
        marginBottom: 10,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceSecondary,
        borderRadius: 18,
        height: 60,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    button: {
        marginTop: 10,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    alreadyAccountText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    footer: {
        marginTop: 40,
        marginBottom: 40,
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

export default SignupScreen;

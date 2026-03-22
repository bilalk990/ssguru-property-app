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
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [role, setRole] = useState('user'); // 'user' or 'agent'
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
        // Debug: Log all field values
        console.log('=== SIGNUP DEBUG ===');
        console.log('Name:', JSON.stringify(name), '(length:', name?.length, ')');
        console.log('Email:', JSON.stringify(email), '(length:', email?.length, ')');
        console.log('Phone:', JSON.stringify(phone), '(length:', phone?.length, ')');
        console.log('Password:', JSON.stringify(password), '(length:', password?.length, ')');
        console.log('Role:', JSON.stringify(role));
        console.log('==================');

        // TEMPORARY: Skip validation for testing
        // if (!name || !email || !password || !phone) {
        //     const missingFields = [];
        //     if (!name) missingFields.push('Name');
        //     if (!phone) missingFields.push('Phone Number');
        //     if (!email) missingFields.push('Email');
        //     if (!password) missingFields.push('Password');
        //     
        //     Alert.alert('Missing Fields', `Please fill in these required fields:\n\n${missingFields.map(f => `• ${f}`).join('\n')}`);
        //     return;
        // }

        // Check with trim and proper validation
        const trimmedName = (name || '').trim();
        const trimmedEmail = (email || '').trim();
        const trimmedPhone = (phone || '').trim();
        const trimmedPassword = (password || '').trim();

        if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedPhone) {
            const missingFields = [];
            if (!trimmedName) missingFields.push('Name');
            if (!trimmedPhone) missingFields.push('Phone Number');
            if (!trimmedEmail) missingFields.push('Email');
            if (!trimmedPassword) missingFields.push('Password');

            Alert.alert('Missing Fields', `Please fill in these required fields:\n\n${missingFields.map(f => `• ${f}`).join('\n')}\n\nDebug Info:\nName: "${name}"\nPhone: "${phone}"\nEmail: "${email}"\nPassword: "${password}"`);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        // Validate phone number (basic check)
        if (trimmedPhone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid phone number (at least 10 digits).');
            return;
        }

        setLoading(true);
        try {
            let requestData;

            if (avatar) {
                // Use FormData if avatar is present
                // IMPORTANT: Do NOT set 'Content-Type': 'multipart/form-data' explicitly in config.
                // Let Axios automatically append the boundary string, otherwise backend's multer crashes (500).
                const formData = new FormData();
                formData.append('name', trimmedName);
                formData.append('email', trimmedEmail);
                formData.append('contact', trimmedPhone); // Backend MUST have 'contact', not 'phone'
                formData.append('role', role);
                formData.append('password', trimmedPassword);

                const fileUri = Platform.OS === 'android' ? avatar.uri : avatar.uri.replace('file://', '');
                formData.append('avatar', {
                    uri: fileUri,
                    type: avatar.type || 'image/jpeg',
                    name: avatar.fileName || `avatar_${Date.now()}.jpg`,
                });

                requestData = formData;
            } else {
                // If no avatar, send clean JSON. Backend route natively supports this via express.json().
                requestData = {
                    name: trimmedName,
                    email: trimmedEmail,
                    contact: trimmedPhone, // Backend MUST have 'contact'
                    role: role,
                    password: trimmedPassword
                };
            }

            const response = await signup(requestData);

            if (response.data) {
                Alert.alert('Success', 'Account created! Please check your email for OTP verification.', [
                    { text: 'OK', onPress: () => navigation.navigate('OTP', { email, mode: 'verify' }) }
                ]);
            }
        } catch (error) {
            console.error('Signup Error:', error);
            console.error('Error Response:', error.response?.data);

            let message = 'Failed to create account. Please try again.';

            if (error.message === 'Network Error' || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                message = 'Cannot connect to server. Please check:\n\n1. Your internet connection\n2. Server might be down\n3. Try again in a moment';
            } else if (error.response) {
                if (error.response.status === 400) {
                    message = error.response.data?.message || 'Missing required fields (Name, Email, Contact, or Password).';
                } else if (error.response.status === 409) {
                    message = error.response.data?.message || 'Email or phone number already in use.';
                } else if (error.response.status === 500) {
                    const serverError = error.response.data ? JSON.stringify(error.response.data) : 'Unknown 500 Error';
                    message = `Internal Server Error (500).\nDetails: ${serverError}`;
                } else if (error.response.data?.message) {
                    message = error.response.data.message;
                } else {
                    message = `Server error (${error.response.status}).`;
                }
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
                        onPress={() => setRole('user')}
                        style={[styles.roleChip, role === 'user' && styles.roleChipActive]}>
                        <Icon name="person" size={20} color={role === 'user' ? Colors.textWhite : Colors.primary} />
                        <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setRole('agent')}
                        style={[styles.roleChip, role === 'agent' && styles.roleChipActive]}>
                        <Icon name="business" size={20} color={role === 'agent' ? Colors.textWhite : Colors.primary} />
                        <Text style={[styles.roleText, role === 'agent' && styles.roleTextActive]}>Agent</Text>
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
        backgroundColor: Colors.surface,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
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

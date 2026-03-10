import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    StatusBar,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { submitEnquiry } from '../../api/propertyApi';
import { cities } from '../../constants/dummyData';

const EnquiryFormScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        city: '',
        requirement: '',
    });
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.phone || !selectedCity || !form.requirement) {
            Alert.alert('Missing Fields', 'Please fill all required fields.');
            return;
        }

        setLoading(true);
        try {
            await submitEnquiry({ ...form, city: selectedCity });
            Alert.alert(
                'Enquiry Submitted! 🎉',
                'We have received your property requirement. Our team will contact you soon.',
                [{ text: 'OK', onPress: () => navigation.goBack() }],
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validCities = cities.filter(c => c !== 'All Cities');

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Submit Enquiry</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoEmoji}>📝</Text>
                    <Text style={styles.infoTitle}>Tell Us What You Need</Text>
                    <Text style={styles.infoDesc}>
                        Share your property requirement and our team will connect you with
                        the right options.
                    </Text>
                </View>

                {/* Form */}
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={Colors.textLight}
                    value={form.name}
                    onChangeText={v => updateField('name', v)}
                />

                <Text style={styles.label}>Phone Number *</Text>
                <View style={styles.phoneContainer}>
                    <View style={styles.countryCode}>
                        <Text style={styles.flag}>🇮🇳</Text>
                        <Text style={styles.codeText}>+91</Text>
                    </View>
                    <TextInput
                        style={[styles.input, styles.phoneInput]}
                        placeholder="Enter phone number"
                        placeholderTextColor={Colors.textLight}
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={form.phone}
                        onChangeText={v => updateField('phone', v)}
                    />
                </View>

                <Text style={styles.label}>Preferred City *</Text>
                <View style={styles.cityContainer}>
                    {validCities.map(city => (
                        <TouchableOpacity
                            key={city}
                            style={[
                                styles.cityChip,
                                selectedCity === city && styles.cityChipActive,
                            ]}
                            onPress={() => setSelectedCity(city)}>
                            <Text
                                style={[
                                    styles.cityChipText,
                                    selectedCity === city && styles.cityChipTextActive,
                                ]}>
                                {city}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Your Requirement *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe what kind of property you're looking for (budget, size, type, etc.)"
                    placeholderTextColor={Colors.textLight}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    value={form.requirement}
                    onChangeText={v => updateField('requirement', v)}
                />

                <CustomButton
                    title="Submit Enquiry"
                    onPress={handleSubmit}
                    loading={loading}
                    size="large"
                    icon="🚀"
                    style={styles.submitButton}
                />

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    scrollContent: {
        padding: 16,
    },
    infoCard: {
        backgroundColor: Colors.primarySoft,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
    },
    infoEmoji: {
        fontSize: 36,
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 6,
    },
    infoDesc: {
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
        marginTop: 4,
    },
    input: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 16,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        gap: 6,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    flag: {
        fontSize: 18,
    },
    codeText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    phoneInput: {
        flex: 1,
        marginBottom: 0,
    },
    textArea: {
        height: 120,
        paddingTop: 14,
    },
    cityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    cityChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cityChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    cityChipText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    cityChipTextActive: {
        color: Colors.textWhite,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: 8,
    },
});

export default EnquiryFormScreen;

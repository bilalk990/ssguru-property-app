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
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import { addRequirement } from '../../api/requirementApi';

const PostRequirementScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        details: '',
        budget: '',
        location: '',
        propertyType: 'Residential'
    });
    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.phone || !form.details) {
            Alert.alert('Incomplete Form', 'Please fill name, phone and basic details.');
            return;
        }

        setLoading(true);
        try {
            await addRequirement({
                ...form,
                details: `${form.details}\nBudget: ${form.budget}\nLocation: ${form.location}`
            });
            Alert.alert(
                'Submitted Successfully! ✅',
                "Your requirement has been posted. Agents will contact you with matching properties.",
                [{ text: 'Great!', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Submit Requirement Error:', error);
            Alert.alert('Error', 'Failed to post requirement. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post Requirement</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBox}>
                    <Icon name="bulb-outline" size={24} color={Colors.primary} />
                    <Text style={styles.infoText}>Can't find what you're looking for? Post it here and our experts will find it for you.</Text>
                </View>

                <Text style={styles.label}>Your Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={form.name}
                    onChangeText={v => updateField('name', v)}
                />

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+91 00000 00000"
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={v => updateField('phone', v)}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Budget Range</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 50L - 1Cr"
                            value={form.budget}
                            onChangeText={v => updateField('budget', v)}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Bandra, Mumbai"
                            value={form.location}
                            onChangeText={v => updateField('location', v)}
                        />
                    </View>
                </View>

                <Text style={styles.label}>Specific Requirement *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe size, floor, facing, amenities etc."
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={form.details}
                    onChangeText={v => updateField('details', v)}
                />

                <CustomButton
                    title="Post Requirement"
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.submitBtn}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    scrollContent: { padding: 20 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.primarySoft,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        gap: 12,
        marginBottom: 25
    },
    infoText: { flex: 1, fontSize: 13, color: Colors.primary, lineHeight: 18, fontWeight: '500' },
    label: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
    input: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 20,
        fontSize: 15,
        color: Colors.textPrimary
    },
    textArea: { height: 120 },
    row: { flexDirection: 'row' },
    submitBtn: { marginTop: 10 }
});

export default PostRequirementScreen;

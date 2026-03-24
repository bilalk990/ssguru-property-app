import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking, TextInput, Alert, ActivityIndicator } from 'react-native';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { submitEnquiry } from '../../api/propertyApi';
import CustomButton from '../../components/CustomButton';

const AboutContactScreen = ({ navigation }) => {
    const [form, setForm] = useState({ name: '', phone: '', details: '' });
    const [loading, setLoading] = useState(false);

    const handleEmail = () => Linking.openURL('mailto:sspropertyguru1@gmail.com');
    const handleCall = () => Linking.openURL('tel:+917400763089');

    const handleEnquiry = async () => {
        if (!form.name || !form.phone || !form.details) {
            Alert.alert('Required', 'Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            await submitEnquiry({
                name: form.name,
                contact: form.phone,
                email: `${form.phone}@noemail.com`,
                city: 'General',
                message: form.details,
            });
            Alert.alert('Success', 'Your requirement has been submitted. Our team will contact you soon.');
            setForm({ name: '', phone: '', details: '' });
        } catch (e) {
            Alert.alert('Error', 'Failed to submit enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support & About</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About SS Property Guru</Text>
                    <Text style={styles.paragraph}>
                        SS Property Guru is a premier real estate platform dedicated to connecting buyers and sellers
                        with the most lucrative opportunities. Our mission is to provide transparency and expert guidance
                        in every transaction.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                        <View style={styles.iconBox}>
                            <Icon name="call-outline" size={24} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Phone</Text>
                            <Text style={styles.contactValue}>+91 7400763089</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                        <View style={styles.iconBox}>
                            <Icon name="mail-outline" size={24} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Email</Text>
                            <Text style={styles.contactValue}>sspropertyguru1@gmail.com</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, styles.enquiryCard]}>
                    <Text style={styles.sectionTitle}>Submit Your Requirement</Text>
                    <Text style={styles.paragraph}>Can't find what you're looking for? Let us know your requirements.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Your Name"
                        value={form.name}
                        onChangeText={(v) => setForm({ ...form, name: v })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(v) => setForm({ ...form, phone: v })}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Requirement Details (Area, Budget, etc.)"
                        multiline
                        numberOfLines={4}
                        value={form.details}
                        onChangeText={(v) => setForm({ ...form, details: v })}
                    />

                    <CustomButton
                        title="Submit Requirement"
                        onPress={handleEnquiry}
                        loading={loading}
                        style={styles.submitBtn}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>
                    <TouchableOpacity style={styles.legalItem}>
                        <Text style={styles.legalText}>Privacy Policy</Text>
                        <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.legalItem}>
                        <Text style={styles.legalText}>Terms & Conditions</Text>
                        <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                    </TouchableOpacity>
                </View>
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
        borderBottomColor: Colors.border,
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    content: { padding: 25 },
    section: { marginBottom: 35 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 15 },
    paragraph: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24 },
    contactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15 },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: Colors.primarySoft,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactLabel: { fontSize: 13, color: Colors.textSecondary },
    contactValue: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    legalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    legalText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500' },
    enquiryCard: {
        backgroundColor: Colors.surfaceSecondary,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    input: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 15,
        marginTop: 15,
        fontSize: 15,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitBtn: {
        marginTop: 20,
    },
});

export default AboutContactScreen;

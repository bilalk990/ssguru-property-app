import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Alert } from 'react-native';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { applyForFranchise } from '../../api/franchiseApi';

const FranchiseScreen = ({ navigation }) => {
    const handleApply = async () => {
        Alert.prompt(
            "Franchise Application",
            "Please enter your phone number to apply:",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Apply",
                    onPress: async (phone) => {
                        if (!phone) return;
                        try {
                            await applyForFranchise({ phone });
                            Alert.alert("Success", "Your franchise application has been submitted!");
                        } catch (e) {
                            Alert.alert("Error", "Failed to submit application.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ... existing sections ... */}
                <View style={styles.heroSection}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000' }}
                        style={styles.heroImage}
                    />
                    <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient} />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color={Colors.textWhite} />
                    </TouchableOpacity>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>Partner with the Best</Text>
                        <Text style={styles.heroSubtitle}>Join SS Property Guru as a Franchise Partner</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Why Choose Us?</Text>
                    <View style={styles.benefitCard}>
                        <Icon name="trending-up-outline" size={32} color={Colors.primary} />
                        <Text style={styles.benefitTitle}>Proven Business Model</Text>
                        <Text style={styles.benefitDesc}>Leverage our established brand and successful real estate strategies.</Text>
                    </View>
                    <View style={styles.benefitCard}>
                        <Icon name="shield-checkmark-outline" size={32} color={Colors.primary} />
                        <Text style={styles.benefitTitle}>Full Training & Support</Text>
                        <Text style={styles.benefitDesc}>Get comprehensive training for you and your staff to ensure success.</Text>
                    </View>

                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <LinearGradient
                            colors={[Colors.primary, '#1B5E20']}
                            style={styles.applyGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.applyText}>Apply for Franchise</Text>
                            <Icon name="arrow-forward" size={20} color={Colors.textWhite} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    heroSection: { height: 350, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    gradient: { ...StyleSheet.absoluteFillObject },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8 },
    heroContent: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    heroTitle: { fontSize: 32, fontWeight: '900', color: Colors.textWhite },
    heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 8 },
    content: { padding: 25 },
    sectionTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 25 },
    benefitCard: {
        backgroundColor: Colors.background,
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    benefitTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 15 },
    benefitDesc: { fontSize: 14, color: Colors.textSecondary, marginTop: 8, lineHeight: 22 },
    applyButton: { marginTop: 20, borderRadius: 18, overflow: 'hidden' },
    applyGradient: { paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    applyText: { fontSize: 16, fontWeight: '700', color: Colors.textWhite },
});

export default FranchiseScreen;

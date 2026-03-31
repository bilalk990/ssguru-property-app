import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback,
    StatusBar, Dimensions, FlatList, ScrollView, Platform, Animated, Alert,
    RefreshControl, TextInput, KeyboardAvoidingView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import PropertyCard, { normalizeProperty } from '../../components/PropertyCard';
import { PropertyCardSkeleton } from '../../components/SkeletonLoader';
import { getProperties } from '../../api/propertyApi';
import { getCurrentStream } from '../../api/streamApi';
import { createEnquiry } from '../../api/enquiryApi';

const { width } = Dimensions.get('window');

const ActionCard = ({ title, desc, icon, color, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
    };

    return (
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
            <Animated.View style={[styles.actionCard, { transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.actionIconBox, { backgroundColor: color }]}>
                    <Icon name={icon} size={24} color={Colors.primary} />
                </View>
                <Text style={styles.actionTitle}>{title}</Text>
                <Text style={styles.actionDesc}>{desc}</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const HomeScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', requirement: '', city: '' });
    const [enquiryLoading, setEnquiryLoading] = useState(false);

    // Premium Staggered Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    // Animate sections independently
    const actionsFade = useRef(new Animated.Value(0)).current;
    const contentFade = useRef(new Animated.Value(0)).current;

    const fetchHomeData = useCallback(async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);

        try {
            const propRes = await getProperties({});
            const listings = propRes.data?.data || propRes.data?.properties || propRes.data || [];
            setProperties(Array.isArray(listings) ? listings : []);
        } catch (error) {
            console.error('Home Data Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);

            // Trigger staggered entry animations when loading finishes
            Animated.stagger(150, [
                Animated.timing(actionsFade, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: true })
            ]).start();
        }
    }, []);

    useEffect(() => {
        fetchHomeData();
        // Initial Header Animation
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true })
        ]).start();
    }, [fadeAnim, slideAnim, fetchHomeData]);

    const handleEnquirySubmit = async () => {
        if (!enquiryForm.name || !enquiryForm.phone || !enquiryForm.requirement) {
            Alert.alert('Incomplete', 'Please fill all fields.');
            return;
        }
        setEnquiryLoading(true);
        try {
            await createEnquiry({
                name: enquiryForm.name,
                contact: enquiryForm.phone,
                message: enquiryForm.requirement,
                city: enquiryForm.city || 'General',
            });
            Alert.alert('Success', 'Your requirement has been sent!');
            setEnquiryForm({ name: '', phone: '', requirement: '', city: '' });
        } catch (e) {
            Alert.alert('Error', 'Failed to send. Try again.');
        } finally {
            setEnquiryLoading(false);
        }
    };

    const featured = properties.filter(p => p.featured || p.isFeatured).map(normalizeProperty);
    const recent = properties.slice(0, 5).map(normalizeProperty);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchHomeData(true)} tintColor={Colors.primary} />
                }
                style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                {/* Premium Gradient Header */}
                <LinearGradient
                    colors={Colors.gradientPrimary}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerLeft}>
                            <Image source={require('../../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
                            <View>
                                <Text style={styles.welcomeText}>Welcome to</Text>
                                <Text style={styles.appName}>Property Guru</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                            <Icon name="person" size={20} color={Colors.textWhite} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>Find Your Premium{'\n'}Property</Text>

                    <View style={styles.searchContainer}>
                        <SearchBar
                            value={search}
                            onChangeText={setSearch}
                            onFilterPress={() => navigation.navigate('Buy')}
                        />
                    </View>
                </LinearGradient>

                {/* Quick Actions with Animation */}
                <Animated.View style={[styles.actionsSection, { opacity: actionsFade }]}>
                    <ActionCard title="Buy" desc="Find homes" icon="home" color={Colors.primarySoft} onPress={() => navigation.navigate('Buy')} />
                    <ActionCard title="Sell" desc="List & Earn" icon="cash" color={Colors.accentSoft} onPress={() => navigation.navigate('Sell')} />
                    <ActionCard title="Enquiry" desc="Expert help" icon="chatbubble-ellipses" color="#F1F5F9" onPress={() => navigation.navigate('Enquiry')} />
                    <ActionCard title="Franchise" desc="Join Us" icon="business" color="#ECFDF5" onPress={() => navigation.navigate('Franchise')} />
                    <ActionCard title="Gallery" desc="View Photos" icon="images" color="#FFFBEB" onPress={() => navigation.navigate('Gallery')} />
                </Animated.View>

                {/* Content Section */}
                <Animated.View style={{ opacity: contentFade, paddingBottom: 80 }}>
                    {loading && !refreshing ? (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Loading Properties...</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                                <PropertyCardSkeleton horizontal />
                                <PropertyCardSkeleton horizontal />
                            </ScrollView>
                        </View>
                    ) : (
                        <>
                            {featured.length > 0 && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <View style={styles.sectionTitleRow}>
                                            <Icon name="star" size={20} color={Colors.accentLight} />
                                            <Text style={styles.sectionTitle}>Featured Properties</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => navigation.navigate('Buy')}>
                                            <Text style={styles.viewAllText}>View All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={featured}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 20 }}
                                        renderItem={({ item }) => (
                                            <PropertyCard property={item} horizontal onPress={() => navigation.navigate('PropertyDetail', { property: item })} />
                                        )}
                                        keyExtractor={item => String(item._id || item.id || Math.random())}
                                    />
                                </View>
                            )}

                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionTitleRow}>
                                        <Icon name="time" size={20} color={Colors.primary} />
                                        <Text style={styles.sectionTitle}>Recent Listings</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate('Buy')}>
                                        <Text style={styles.viewAllText}>View All</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingHorizontal: 20 }}>
                                    {recent.length === 0 ? (
                                        <View style={styles.emptyContainer}>
                                            <Icon name="documents-outline" size={48} color={Colors.textLight} />
                                            <Text style={styles.emptyText}>No premium properties found yet</Text>
                                        </View>
                                    ) : (
                                        recent.map((property, idx) => (
                                            <PropertyCard key={String(property._id || property.id || idx)} property={property} onPress={() => navigation.navigate('PropertyDetail', { property })} />
                                        ))
                                    )}
                                </View>
                            </View>

                            {/* Premium Quick Enquiry Form */}
                            <View style={[styles.section, styles.enquirySection]}>
                                <View style={styles.enquiryCard}>
                                    <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.enquiryDecoration} />
                                    <Text style={styles.enquiryTitle}>Premium Enquiry</Text>
                                    <Text style={styles.enquirySubtitle}>Let our elite agents find your perfect match.</Text>

                                    <TextInput style={styles.enquiryInput} placeholder="Your Full Name" placeholderTextColor={Colors.textLight} value={enquiryForm.name} onChangeText={(v) => setEnquiryForm(prev => ({ ...prev, name: v }))} />
                                    <TextInput style={styles.enquiryInput} placeholder="Phone Number" placeholderTextColor={Colors.textLight} keyboardType="phone-pad" value={enquiryForm.phone} onChangeText={(v) => setEnquiryForm(prev => ({ ...prev, phone: v }))} />
                                    <TextInput style={[styles.enquiryInput, { height: 90, paddingTop: 14 }]} placeholder="What exactly are you looking for?" placeholderTextColor={Colors.textLight} multiline value={enquiryForm.requirement} onChangeText={(v) => setEnquiryForm(prev => ({ ...prev, requirement: v }))} />

                                    <TouchableOpacity style={styles.enquirySubmitBtn} onPress={handleEnquirySubmit} disabled={enquiryLoading}>
                                        <LinearGradient colors={Colors.gradientAccent} style={styles.enquiryBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                            <Text style={styles.enquirySubmitText}>Request Callback</Text>
                                            <Icon name="arrow-forward" size={18} color="#FFF" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                </Animated.View>
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
    scrollContent: { paddingBottom: 20 },
    header: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        elevation: 15,
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    welcomeText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
    appName: { fontSize: 20, fontWeight: '800', color: Colors.textWhite, letterSpacing: 0.5 },
    headerLogo: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.textWhite },
    profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 34, fontWeight: '900', color: Colors.textWhite, lineHeight: 42, marginBottom: 20 },
    searchContainer: { marginTop: 10 },
    actionsSection: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingTop: 30, gap: 14, justifyContent: 'center' },
    actionCard: {
        width: (width - 68) / 3,
        backgroundColor: Colors.backgroundCard,
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        elevation: 8,
        shadowColor: Colors.shadowPremium,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    actionIconBox: { width: 50, height: 50, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    actionTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4, textAlign: 'center' },
    actionDesc: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', fontWeight: '500' },
    section: { marginTop: 35 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
    viewAllText: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
    enquirySection: { paddingHorizontal: 20, marginTop: 40 },
    enquiryCard: { backgroundColor: Colors.backgroundCard, borderRadius: 32, padding: 28, elevation: 12, shadowColor: Colors.shadowPremium, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 30, overflow: 'hidden' },
    enquiryDecoration: { position: 'absolute', top: 0, left: 0, right: 0, height: 6 },
    enquiryTitle: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
    enquirySubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24, lineHeight: 22 },
    enquiryInput: { backgroundColor: Colors.surfaceSecondary, borderRadius: 16, padding: 18, marginBottom: 14, fontSize: 15, color: Colors.textPrimary },
    enquirySubmitBtn: { marginTop: 10, borderRadius: 16, overflow: 'hidden', elevation: 6 },
    enquiryBtnGradient: { paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    enquirySubmitText: { color: Colors.textWhite, fontSize: 17, fontWeight: '800' },
    emptyContainer: { alignItems: 'center', paddingVertical: 40, backgroundColor: Colors.surfaceSecondary, borderRadius: 20 },
    emptyText: { color: Colors.textSecondary, fontSize: 15, marginTop: 12, fontWeight: '500' },
});

export default HomeScreen;

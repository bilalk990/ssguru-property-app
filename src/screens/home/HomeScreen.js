import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StatusBar,
    Dimensions,
    FlatList,
    ScrollView,
    Platform,
    Animated,
    Alert,
    RefreshControl,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import PropertyCard, { normalizeProperty } from '../../components/PropertyCard';
import { getProperties } from '../../api/propertyApi';
import { getCurrentStream } from '../../api/streamApi';
import { createEnquiry } from '../../api/enquiryApi';

const { width } = Dimensions.get('window');

const ActionCard = ({ title, desc, icon, color, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
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

const AgenciesSection = ({ franchises, navigation }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agencies</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {franchises.map((item, idx) => (
                <TouchableOpacity
                    key={String(item._id || item.id || idx)}
                    style={styles.agencyCard}
                    onPress={() => navigation.navigate('Buy', { franchiseId: item._id || item.id })}
                >
                    <Image source={{ uri: item.image || item.logo || 'https://via.placeholder.com/100' }} style={styles.agencyImage} />
                    <Text style={styles.agencyName} numberOfLines={1}>{item.name || 'Agency'}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const AgentsSection = ({ agents, navigation }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
                <Icon name="people" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Elite Agents</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Agents')}>
                <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {agents.map((item, idx) => (
                <TouchableOpacity
                    key={String(item._id || item.id || idx)}
                    style={styles.agentCard}
                    onPress={() => navigation.navigate('Buy', { agentId: item._id || item.id })}
                >
                    <Image source={{ uri: item.avatar || 'https://i.pravatar.cc/150' }} style={styles.agentImage} />
                    <Text style={styles.agentName} numberOfLines={1}>{item.name || 'Agent'}</Text>
                    <Text style={styles.agentRole}>Elite Agent</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const HomeScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [properties, setProperties] = useState([]);
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', requirement: '', city: '' });
    const [enquiryLoading, setEnquiryLoading] = useState(false);

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

    const fetchHomeData = useCallback(async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);

        try {
            const [propRes, streamRes] = await Promise.all([
                getProperties({}).catch(() => ({ data: [] })),
                getCurrentStream().catch(() => ({ data: null }))
            ]);

            const listings = propRes.data?.data || propRes.data?.properties || propRes.data || [];
            setProperties(Array.isArray(listings) ? listings : []);
            setIsLive(!!(streamRes.data?.data?.youtubeUrl && streamRes.data?.data?.isActive));
        } catch (error) {
            console.error('Home Data Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchHomeData();
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 7, useNativeDriver: true })
        ]).start();
    }, [fadeAnim, slideAnim, fetchHomeData]);

    const onRefresh = () => fetchHomeData(true);

    const featured = properties.filter(p => p.featured || p.isFeatured).map(normalizeProperty);
    const recent = properties.slice(0, 5).map(normalizeProperty);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
                style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                {/* Header with Gradient */}
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
                            <Icon name="person-circle-outline" size={28} color={Colors.textWhite} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>Find Your Dream{'\n'}Property</Text>

                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchBar}
                        onFilterPress={() => navigation.navigate('Buy')}
                    />
                </LinearGradient>

                {/* Quick Actions */}
                <View style={styles.actionsSection}>
                    <ActionCard title="Buy" desc="Find homes" icon="home" color={Colors.primarySoft} onPress={() => navigation.navigate('Buy')} />
                    <ActionCard title="Sell" desc="List & Earn" icon="cash" color={Colors.accentSoft} onPress={() => navigation.navigate('Sell')} />
                    <ActionCard title="Enquiry" desc="Expert help" icon="chatbubble-ellipses" color="#EDE7F6" onPress={() => navigation.navigate('Enquiry')} />
                    <ActionCard
                        title={isLive ? "Live Tour 🔴" : "Live Tour"}
                        desc={isLive ? "Join Now" : "Coming Soon"}
                        icon="videocam"
                        color={isLive ? "#FFEBEE" : "#F5F5F5"}
                        onPress={() => isLive ? navigation.navigate('LiveTour') : Alert.alert('Offline', 'No live tour currently.')}
                    />
                    <ActionCard title="Gallery" desc="View Photos" icon="images" color="#FFF3E0" onPress={() => navigation.navigate('Gallery')} />
                    <ActionCard title="Franchise" desc="Join Us" icon="business" color="#E1F5FE" onPress={() => navigation.navigate('Franchise')} />
                </View>

                {loading && !refreshing ? (
                    <View style={{ marginTop: 100 }}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                ) : (
                    <>
                        {featured.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionTitleRow}>
                                        <Icon name="star" size={20} color={Colors.warning} />
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
                            {recent.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Icon name="home-outline" size={40} color={Colors.textLight} />
                                    <Text style={styles.emptyText}>No properties found yet</Text>
                                </View>
                            ) : (
                                recent.map((property, idx) => (
                                    <PropertyCard key={String(property._id || property.id || idx)} property={property} onPress={() => navigation.navigate('PropertyDetail', { property })} />
                                ))
                            )}
                        </View>

                        {/* Quick Enquiry Form */}
                        <View style={[styles.section, styles.enquirySection]}>
                            <View style={styles.enquiryCard}>
                                <Text style={styles.enquiryTitle}>Quick Enquiry</Text>
                                <Text style={styles.enquirySubtitle}>Enter your requirement and we'll contact you</Text>
                                <TextInput
                                    style={styles.enquiryInput}
                                    placeholder="Your Name"
                                    placeholderTextColor={Colors.textLight}
                                    value={enquiryForm.name}
                                    onChangeText={(v) => setEnquiryForm(prev => ({ ...prev, name: v }))}
                                />
                                <TextInput
                                    style={styles.enquiryInput}
                                    placeholder="Phone Number"
                                    placeholderTextColor={Colors.textLight}
                                    keyboardType="phone-pad"
                                    value={enquiryForm.phone}
                                    onChangeText={(v) => setEnquiryForm(prev => ({ ...prev, phone: v }))}
                                />
                                <TextInput
                                    style={styles.enquiryInput}
                                    placeholder="City / Area"
                                    placeholderTextColor={Colors.textLight}
                                    value={enquiryForm.city}
                                    onChangeText={(v) => setEnquiryForm(prev => ({ ...prev, city: v }))}
                                />
                                <TextInput
                                    style={[styles.enquiryInput, { height: 80 }]}
                                    placeholder="What are you looking for?"
                                    placeholderTextColor={Colors.textLight}
                                    multiline
                                    value={enquiryForm.requirement}
                                    onChangeText={(v) => setEnquiryForm(prev => ({ ...prev, requirement: v }))}
                                />
                                <TouchableOpacity style={styles.enquirySubmitBtn} onPress={handleEnquirySubmit} disabled={enquiryLoading}>
                                    {enquiryLoading ? <ActivityIndicator color={Colors.textWhite} size="small" /> : <Text style={styles.enquirySubmitText}>Send Requirement</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}

                <TouchableOpacity style={styles.enquiryCTA} activeOpacity={0.9} onPress={() => navigation.navigate('PostRequirement')}>
                    <LinearGradient colors={['#1B5E20', '#0A1F0D']} style={styles.ctaContent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <Icon name="construct" size={40} color={Colors.accentMuted} style={styles.ctaIcon} />
                        <View style={styles.ctaTextContainer}>
                            <Text style={styles.ctaTitle}>Can't find it?</Text>
                            <Text style={styles.ctaSubtitle}>Submit detailed requirements and our team will find the data.</Text>
                        </View>
                        <Icon name="arrow-forward-circle" size={32} color={Colors.textWhite} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
    scrollContent: { paddingBottom: 40 },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 35,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 10,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    welcomeText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
    appName: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
    headerLogo: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.textWhite },
    profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 32, fontWeight: '800', color: Colors.textWhite, lineHeight: 40, marginBottom: 25 },
    searchBar: { marginTop: 5 },
    actionsSection: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingTop: 24, gap: 12, justifyContent: 'center' },
    actionCard: {
        width: (width - 56) / 3,
        backgroundColor: Colors.backgroundCard,
        borderRadius: 20,
        padding: 12,
        elevation: 3,
        alignItems: 'center',
    },
    actionIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    actionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2, textAlign: 'center' },
    actionDesc: { fontSize: 9, color: Colors.textSecondary, textAlign: 'center' },
    section: { paddingHorizontal: 16, marginTop: 30 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 19, fontWeight: '800', color: Colors.textPrimary },
    viewAllText: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
    horizontalScroll: { paddingRight: 16 },
    agencyCard: { width: 90, alignItems: 'center', marginRight: 12 },
    agencyImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 6, backgroundColor: Colors.border },
    agencyName: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
    agentCard: { width: 90, alignItems: 'center', marginRight: 12 },
    agentImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 6, backgroundColor: Colors.border },
    agentName: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
    agentRole: { fontSize: 9, color: Colors.primary, fontWeight: '600' },
    enquirySection: { marginTop: 30 },
    enquiryCard: { backgroundColor: Colors.backgroundCard, borderRadius: 24, padding: 24, elevation: 4 },
    enquiryTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
    enquirySubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
    enquiryInput: { backgroundColor: Colors.backgroundSecondary, borderRadius: 12, padding: 14, marginBottom: 10, fontSize: 14, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
    enquirySubmitBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 5 },
    enquirySubmitText: { color: Colors.textWhite, fontSize: 15, fontWeight: '700' },
    enquiryCTA: { marginHorizontal: 16, marginTop: 30, borderRadius: 24, overflow: 'hidden', elevation: 6 },
    ctaContent: { padding: 20, flexDirection: 'row', alignItems: 'center' },
    ctaIcon: { marginRight: 15 },
    ctaTextContainer: { flex: 1 },
    ctaTitle: { fontSize: 17, fontWeight: '800', color: Colors.textWhite, marginBottom: 4 },
    ctaSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
    emptyContainer: { alignItems: 'center', marginTop: 20 },
    emptyText: { color: Colors.textLight, fontSize: 14 },
});

export default HomeScreen;

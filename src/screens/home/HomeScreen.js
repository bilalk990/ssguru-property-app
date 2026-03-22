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
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import PropertyCard from '../../components/PropertyCard';
import { getProperties } from '../../api/propertyApi';
import { getTopAgents } from '../../api/agentApi';
import { getFranchises } from '../../api/franchiseApi';
import { getCurrentStream } from '../../api/streamApi';
import { propertyTypes } from '../../constants/appConstants';

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
            {franchises.map(item => (
                <TouchableOpacity
                    key={item.id || item._id}
                    style={styles.agencyCard}
                    onPress={() => navigation.navigate('Projects', { franchiseId: item.id || item._id })}
                >
                    <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} style={styles.agencyImage} />
                    <Text style={styles.agencyName} numberOfLines={1}>{item.name}</Text>
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
            {agents.map(item => (
                <TouchableOpacity
                    key={item.id || item._id}
                    style={styles.agentCard}
                    onPress={() => navigation.navigate('Projects', { agentId: item.id || item._id })}
                >
                    <Image source={{ uri: item.avatar || 'https://i.pravatar.cc/150' }} style={styles.agentImage} />
                    <Text style={styles.agentName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.agentRole}>Elite Agent</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const HomeScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [properties, setProperties] = useState([]);
    const [agents, setAgents] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const fetchHomeData = useCallback(async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);

        try {
            const [propRes, agentRes, franchiseRes, streamRes] = await Promise.all([
                getProperties({ limit: 10 }),
                getTopAgents(),
                getFranchises({ limit: 5 }).catch(() => ({ data: [] })),
                getCurrentStream().catch(() => ({ data: null }))
            ]);

            const listings = propRes.data?.properties || propRes.data || [];
            const topAgents = agentRes.data?.agents || agentRes.data || [];
            const topFranchises = franchiseRes.data?.franchise || franchiseRes.data || [];

            setProperties(listings);
            setAgents(topAgents);
            setFranchises(topFranchises);
            setIsLive(!!streamRes.data?.url);
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
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 40,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, slideAnim, fetchHomeData]);

    const onRefresh = () => fetchHomeData(true);

    const featured = properties.filter(p => p.featured || p.isFeatured);
    const recent = properties.slice(0, 5);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
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
                            <Image
                                source={require('../../assets/logo.png')}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                            <View>
                                <Text style={styles.welcomeText}>Welcome to</Text>
                                <Text style={styles.appName}>Property Guru</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('ProfileTab')}>
                            <Icon name="person-circle-outline" size={28} color={Colors.textWhite} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>Find Your Dream{'\n'}Property</Text>

                    {/* Search Bar */}
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchBar}
                        onFilterPress={() => navigation.navigate('Projects')}
                    />
                </LinearGradient>

                {/* Quick Actions */}
                <View style={styles.actionsSection}>
                    <ActionCard
                        title="Buy"
                        desc="Find homes"
                        icon="home"
                        color={Colors.primarySoft}
                        onPress={() => navigation.navigate('Projects')}
                    />
                    <ActionCard
                        title="Sell"
                        desc="List & Earn"
                        icon="cash"
                        color={Colors.accentSoft}
                        onPress={() => navigation.navigate('Sell')}
                    />
                    <ActionCard
                        title="Enquiry"
                        desc="Expert help"
                        icon="chatbubble-ellipses"
                        color="#EDE7F6"
                        onPress={() => navigation.navigate('Enquiry')}
                    />
                    <ActionCard
                        title="Our Agents"
                        desc="Meet experts"
                        icon="people"
                        color="#E8F5E9"
                        onPress={() => navigation.navigate('Agents')}
                    />
                    <ActionCard
                        title="Gallery"
                        desc="Showcases"
                        icon="images"
                        color="#FFF3E0"
                        onPress={() => navigation.navigate('Gallery')}
                    />
                    <ActionCard
                        title="Franchise"
                        desc="Partner"
                        icon="briefcase"
                        color="#F3E5F5"
                        onPress={() => navigation.navigate('Franchise')}
                    />
                </View>

                {loading && !refreshing ? (
                    <View style={{ marginTop: 100 }}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                ) : (
                    <>
                        {/* Featured Properties Section (Existing) */}
                        {featured.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionTitleRow}>
                                        <Icon name="star" size={20} color={Colors.warning} />
                                        <Text style={styles.sectionTitle}>Featured Properties</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
                                        <Text style={styles.viewAllText}>View All</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={featured}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.featuredList}
                                    renderItem={({ item }) => (
                                        <PropertyCard
                                            property={item}
                                            horizontal
                                            onPress={() =>
                                                navigation.navigate('PropertyDetail', { property: item })
                                            }
                                        />
                                    )}
                                    keyExtractor={item => (item.id || item._id).toString()}
                                />
                            </View>
                        )}

                        {/* Agencies Section */}
                        <AgenciesSection franchises={franchises} navigation={navigation} />

                        {/* Top Agents Section */}
                        <AgentsSection agents={agents} navigation={navigation} />

                        {/* Recent Properties */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleRow}>
                                    <Icon name="time" size={20} color={Colors.primary} />
                                    <Text style={styles.sectionTitle}>Recent Listings</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
                                    <Text style={styles.viewAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            {recent.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Icon name="home-outline" size={40} color={Colors.textLight} />
                                    <Text style={styles.emptyText}>No properties found yet</Text>
                                </View>
                            ) : (
                                recent.map(property => (
                                    <PropertyCard
                                        key={property.id || property._id}
                                        property={property}
                                        onPress={() =>
                                            navigation.navigate('PropertyDetail', { property })
                                        }
                                    />
                                ))
                            )}
                        </View>
                    </>
                )}

                {/* Enquiry CTA */}
                <TouchableOpacity
                    style={styles.enquiryCTA}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('PostRequirement')}>
                    <LinearGradient
                        colors={['#1B5E20', '#0A1F0D']}
                        style={styles.ctaContent}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <Icon name="construct" size={40} color={Colors.accentMuted} style={styles.ctaIcon} />
                        <View style={styles.ctaTextContainer}>
                            <Text style={styles.ctaTitle}>Can't find it?</Text>
                            <Text style={styles.ctaSubtitle}>
                                Submit your detailed requirements and our team will find the data.
                            </Text>
                        </View>
                        <Icon name="arrow-forward-circle" size={32} color={Colors.textWhite} />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Live Floating Button */}
                {isLive && (
                    <TouchableOpacity
                        style={styles.liveFloat}
                        onPress={() => navigation.navigate('LiveTour')}
                    >
                        <View style={styles.liveDot} />
                        <Text style={styles.liveFloatText}>WATCH LIVE TOUR</Text>
                    </TouchableOpacity>
                )}

            </Animated.ScrollView>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 35,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 10,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    welcomeText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    appName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textWhite,
    },
    headerLogo: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.textWhite,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.textWhite,
        lineHeight: 40,
        marginBottom: 25,
    },
    searchBar: {
        marginTop: 5,
    },
    // Quick Actions
    actionsSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 12,
        justifyContent: 'space-between',
    },
    actionCard: {
        width: (width - 48) / 3, // Three columns
        backgroundColor: Colors.backgroundCard,
        borderRadius: 20,
        padding: 12,
        elevation: 3,
        shadowColor: Colors.shadowMedium,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        alignItems: 'center',
    },
    actionIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 2,
        textAlign: 'center',
    },
    actionDesc: {
        fontSize: 9,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    // Sections
    section: {
        paddingHorizontal: 16,
        marginTop: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    viewAllText: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '700',
    },
    featuredList: {
        paddingRight: 16,
    },
    // Enquiry CTA
    enquiryCTA: {
        marginHorizontal: 16,
        marginTop: 30,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    ctaContent: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ctaIcon: {
        marginRight: 15,
    },
    ctaTextContainer: {
        flex: 1,
    },
    ctaTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: Colors.textWhite,
        marginBottom: 4,
    },
    ctaSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 18,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    emptyText: {
        color: Colors.textLight,
        fontSize: 14,
        marginTop: 10,
    },
    // New Styles
    agentList: {
        paddingRight: 16,
        paddingBottom: 5,
    },
    agentSmallCard: {
        width: 100,
        backgroundColor: Colors.background,
        borderRadius: 15,
        padding: 12,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    agentAvatarSmall: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
    },
    agentNameSmall: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    agentStatsSmall: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    horizontalScroll: {
        paddingRight: 16,
        paddingBottom: 5,
    },
    agencyCard: {
        width: 90,
        alignItems: 'center',
        marginRight: 12,
    },
    agencyImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 6,
        backgroundColor: Colors.border,
    },
    agencyName: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    agentCard: {
        width: 90,
        alignItems: 'center',
        marginRight: 12,
    },
    agentImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 6,
        backgroundColor: Colors.border,
    },
    agentName: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    agentRole: {
        fontSize: 9,
        color: Colors.primary,
        fontWeight: '600',
    },
        position: 'absolute',
        top: 130, // Below search bar area
        right: 0,
        backgroundColor: '#FF0000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        zIndex: 100,
        elevation: 10,
        gap: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFF',
    },
    liveFloatText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});

export default HomeScreen;

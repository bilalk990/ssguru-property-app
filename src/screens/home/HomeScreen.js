import React, { useState, useEffect, useRef } from 'react';
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
    Platform,
    Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import PropertyCard from '../../components/PropertyCard';
import { featuredProperties } from '../../constants/dummyData';

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

const HomeScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
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
    }, [fadeAnim, slideAnim]);

    const featured = featuredProperties.filter(p => p.featured);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
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
                        onFilterPress={() => navigation.navigate('BuyTab')}
                    />
                </LinearGradient>

                {/* Quick Actions */}
                <View style={styles.actionsSection}>
                    <ActionCard
                        title="Buy"
                        desc="Find homes"
                        icon="home"
                        color={Colors.primarySoft}
                        onPress={() => navigation.navigate('BuyTab')}
                    />
                    <ActionCard
                        title="Sell"
                        desc="List & Earn"
                        icon="cash"
                        color={Colors.accentSoft}
                        onPress={() => navigation.navigate('SellTab')}
                    />
                    <ActionCard
                        title="Enquiry"
                        desc="Expert help"
                        icon="chatbubble-ellipses"
                        color="#EDE7F6"
                        onPress={() => navigation.navigate('Enquiry')}
                    />
                    <ActionCard
                        title="My Ops"
                        desc="Manage all"
                        icon="apps"
                        color="#E3F2FD"
                        onPress={() => navigation.navigate('MyProperties')}
                    />
                </View>

                {/* Featured Properties */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <Icon name="star" size={20} color={Colors.warning} />
                            <Text style={styles.sectionTitle}>Featured Properties</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('BuyTab')}>
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
                        keyExtractor={item => item.id.toString()}
                    />
                </View>

                {/* Recent Properties */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <Icon name="time" size={20} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Recent Listings</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('BuyTab')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {featuredProperties.slice(0, 3).map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onPress={() =>
                                navigation.navigate('PropertyDetail', { property })
                            }
                        />
                    ))}
                </View>

                {/* Enquiry CTA */}
                <TouchableOpacity
                    style={styles.enquiryCTA}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('Enquiry')}>
                    <LinearGradient
                        colors={['#1B5E20', '#0A1F0D']}
                        style={styles.ctaContent}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <Icon name="construct" size={40} color={Colors.accentMuted} style={styles.ctaIcon} />
                        <View style={styles.ctaTextContainer}>
                            <Text style={styles.ctaTitle}>Can't find it?</Text>
                            <Text style={styles.ctaSubtitle}>
                                Submit your requirement and we'll help you find it!
                            </Text>
                        </View>
                        <Icon name="arrow-forward-circle" size={32} color={Colors.textWhite} />
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
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
        width: (width - 44) / 2,
        backgroundColor: Colors.backgroundCard,
        borderRadius: 20,
        padding: 16,
        elevation: 3,
        shadowColor: Colors.shadowMedium,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    actionIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    actionDesc: {
        fontSize: 11,
        color: Colors.textSecondary,
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
});

export default HomeScreen;

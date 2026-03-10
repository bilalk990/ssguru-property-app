import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    FlatList,
    Platform,
} from 'react-native';
import Colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import PropertyCard from '../../components/PropertyCard';
import { featuredProperties } from '../../constants/dummyData';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');

    const featured = featuredProperties.filter(p => p.featured);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerLeft}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('ProfileTab')}>
                            <Text style={styles.profileIcon}>👤</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerTitle}>Find Your Dream{'\n'}Property</Text>
                    <Text style={styles.headerSubtitle}>
                        Discover the best properties across India
                    </Text>

                    {/* Search Bar */}
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchBar}
                        onFilterPress={() => navigation.navigate('BuyTab')}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('BuyTab')}>
                        <View style={[styles.actionIconBox, { backgroundColor: Colors.primarySoft }]}>
                            <Text style={styles.actionEmoji}>🏠</Text>
                        </View>
                        <Text style={styles.actionTitle}>Buy Property</Text>
                        <Text style={styles.actionDesc}>Browse listings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('SellTab')}>
                        <View style={[styles.actionIconBox, { backgroundColor: Colors.accentSoft }]}>
                            <Text style={styles.actionEmoji}>💰</Text>
                        </View>
                        <Text style={styles.actionTitle}>Sell Property</Text>
                        <Text style={styles.actionDesc}>List your property</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('Enquiry')}>
                        <View style={[styles.actionIconBox, { backgroundColor: '#EDE7F6' }]}>
                            <Text style={styles.actionEmoji}>📝</Text>
                        </View>
                        <Text style={styles.actionTitle}>Enquiry</Text>
                        <Text style={styles.actionDesc}>Submit requirement</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('MyProperties')}>
                        <View style={[styles.actionIconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Text style={styles.actionEmoji}>📋</Text>
                        </View>
                        <Text style={styles.actionTitle}>My Listings</Text>
                        <Text style={styles.actionDesc}>Manage properties</Text>
                    </TouchableOpacity>
                </View>

                {/* Featured Properties */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>⭐ Featured Properties</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('BuyTab')}>
                            <Text style={styles.viewAllText}>View All →</Text>
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
                        <Text style={styles.sectionTitle}>🏘️ Recent Listings</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('BuyTab')}>
                            <Text style={styles.viewAllText}>View All →</Text>
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
                    <View style={styles.ctaContent}>
                        <Text style={styles.ctaEmoji}>🏗️</Text>
                        <Text style={styles.ctaTitle}>
                            Can't find what you're looking for?
                        </Text>
                        <Text style={styles.ctaSubtitle}>
                            Submit your property requirement and we'll help you find it!
                        </Text>
                        <View style={styles.ctaButton}>
                            <Text style={styles.ctaButtonText}>Submit Enquiry →</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
            </ScrollView>
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
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerLogo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: Colors.textWhite,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        fontSize: 22,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textWhite,
        lineHeight: 36,
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
    },
    searchBar: {
        marginBottom: 4,
    },
    // Quick Actions
    actionsSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingTop: 20,
        gap: 10,
        justifyContent: 'space-between',
    },
    actionCard: {
        width: (width - 52) / 2,
        backgroundColor: Colors.backgroundCard,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionIconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionEmoji: {
        fontSize: 22,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    actionDesc: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    // Sections
    section: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    viewAllText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    featuredList: {
        paddingLeft: 0,
        paddingRight: 16,
    },
    // Enquiry CTA
    enquiryCTA: {
        marginHorizontal: 16,
        marginTop: 24,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: Colors.primaryDark,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    ctaContent: {
        padding: 24,
        alignItems: 'center',
    },
    ctaEmoji: {
        fontSize: 40,
        marginBottom: 12,
    },
    ctaTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.textWhite,
        textAlign: 'center',
        marginBottom: 8,
    },
    ctaSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    ctaButton: {
        backgroundColor: Colors.accentLight,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    ctaButtonText: {
        color: Colors.textWhite,
        fontWeight: '700',
        fontSize: 14,
    },
});

export default HomeScreen;

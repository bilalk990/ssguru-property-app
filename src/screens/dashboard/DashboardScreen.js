import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/colors';
import { getPropertiesByAgent } from '../../api/propertyApi';
import { normalizeProperty } from '../../components/PropertyCard';
import authStore from '../../store/authStore';

const DashboardScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = useCallback(async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);

        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            const userData = userDataStr ? JSON.parse(userDataStr) : null;
            setUser(userData);

            if (userData?.id || userData?._id) {
                const userId = userData.id || userData._id;
                const response = await getPropertiesByAgent(userId);
                const props = response.data?.data || response.data || [];
                setProperties(Array.isArray(props) ? props.map(normalizeProperty) : []);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const onRefresh = () => fetchDashboardData(true);

    if (loading && !user) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }>

                {/* Header */}
                <LinearGradient
                    colors={Colors.gradientPrimary}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome Back!</Text>
                            <Text style={styles.userName}>{user?.name || 'User'}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('Profile')}>
                            <Image
                                source={{ uri: user?.avatar || 'https://i.pravatar.cc/150' }}
                                style={styles.profileImage}
                            />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconBox}>
                            <Icon name="home" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.statValue}>{properties.length}</Text>
                        <Text style={styles.statLabel}>My Properties</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statIconBox}>
                            <Icon name="people" size={24} color={Colors.accent} />
                        </View>
                        <Text style={styles.statValue}>-</Text>
                        <Text style={styles.statLabel}>Enquiries</Text>
                    </View>
                </View>

                {/* Buy / Sell Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={[styles.actionCard, styles.buyCard]}
                            onPress={() => navigation.navigate('Buy', { screen: 'BuyMain' })}
                            activeOpacity={0.85}>
                            <View style={[styles.actionIconBox, { backgroundColor: Colors.primarySoft }]}>
                                <Icon name="home" size={26} color={Colors.primary} />
                            </View>
                            <Text style={styles.actionTitle}>Buy Property</Text>
                            <Text style={styles.actionCount}>Browse all listings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, styles.sellCard]}
                            onPress={async () => {
                                const token = await AsyncStorage.getItem('authToken');
                                if (!token) {
                                    navigation.navigate('Login');
                                } else {
                                    navigation.navigate('AddProperty');
                                }
                            }}
                            activeOpacity={0.85}>
                            <View style={[styles.actionIconBox, { backgroundColor: '#E8F5E9' }]}>
                                <Icon name="add-circle" size={26} color="#2E7D32" />
                            </View>
                            <Text style={styles.actionTitle}>Sell Property</Text>
                            <Text style={styles.actionCount}>Add new listing</Text>
                        </TouchableOpacity>
                    </View>

                    {/* My Properties row */}
                    <TouchableOpacity
                        style={styles.myPropertiesRow}
                        onPress={() => navigation.navigate('MyProperties')}
                        activeOpacity={0.8}>
                        <View style={[styles.actionIconBox, { backgroundColor: Colors.primarySoft, marginBottom: 0 }]}>
                            <Icon name="list" size={22} color={Colors.primary} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text style={styles.actionTitle}>My Properties</Text>
                            <Text style={styles.actionCount}>{properties.length} listed</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color={Colors.textLight} />
                    </TouchableOpacity>
                </View>

                {/* Recent Properties */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Recent Listings</Text>
                        {properties.length > 0 && (
                            <TouchableOpacity onPress={() => navigation.navigate('MyProperties')}>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {properties.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon name="home-outline" size={60} color={Colors.textLight} />
                            <Text style={styles.emptyTitle}>No Properties Yet</Text>
                            <Text style={styles.emptyText}>Start by adding your first property</Text>
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => navigation.navigate('AddProperty')}>
                                <Text style={styles.emptyButtonText}>Add Property</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        properties.slice(0, 3).map((property, index) => (
                            <TouchableOpacity
                                key={String(property._id || index)}
                                style={styles.propertyItem}
                                onPress={() => navigation.navigate('PropertyDetail', { property })}>
                                <Image
                                    source={{ uri: property.images?.[0] || 'https://via.placeholder.com/100' }}
                                    style={styles.propertyImage}
                                />
                                <View style={styles.propertyInfo}>
                                    <Text style={styles.propertyTitle} numberOfLines={1}>
                                        {property.title}
                                    </Text>
                                    <Text style={styles.propertyLocation} numberOfLines={1}>
                                        {property.area}, {property.city}
                                    </Text>
                                    <Text style={styles.propertyPrice}>{property.price}</Text>
                                </View>
                                <Icon name="chevron-forward" size={20} color={Colors.textLight} />
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    welcomeText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
    userName: { fontSize: 24, fontWeight: '800', color: Colors.textWhite },
    profileButton: {
        width: 50, height: 50, borderRadius: 25, overflow: 'hidden',
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    },
    profileImage: { width: '100%', height: '100%' },
    statsContainer: {
        flexDirection: 'row', paddingHorizontal: 20, marginTop: -20, gap: 15,
    },
    statCard: {
        flex: 1, backgroundColor: Colors.backgroundCard, borderRadius: 16,
        padding: 20, alignItems: 'center', elevation: 3,
        shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 8,
    },
    statIconBox: {
        width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primarySoft,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    statValue: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
    statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
    section: { paddingHorizontal: 20, marginTop: 30 },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16,
    },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
    viewAllText: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
    actionGrid: { flexDirection: 'row', gap: 15, marginBottom: 15 },
    actionCard: {
        flex: 1, backgroundColor: Colors.backgroundCard, borderRadius: 16,
        padding: 20, alignItems: 'center', elevation: 2,
        shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 6,
    },
    buyCard: { borderWidth: 1.5, borderColor: Colors.primary },
    sellCard: { borderWidth: 1.5, borderColor: '#2E7D32' },
    actionIconBox: {
        width: 56, height: 56, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    actionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
    actionCount: { fontSize: 12, color: Colors.textSecondary },
    myPropertiesRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.backgroundCard, borderRadius: 16,
        padding: 16, elevation: 2,
        shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, shadowRadius: 4,
    },
    emptyState: { alignItems: 'center', paddingVertical: 50 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 20, marginBottom: 8 },
    emptyText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
    emptyButton: { backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 14, borderRadius: 12 },
    emptyButtonText: { color: Colors.textWhite, fontSize: 15, fontWeight: '700' },
    propertyItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundCard,
        borderRadius: 16, padding: 12, marginBottom: 12, elevation: 2,
        shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, shadowRadius: 4,
    },
    propertyImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: Colors.border },
    propertyInfo: { flex: 1, marginLeft: 12 },
    propertyTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
    propertyLocation: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
    propertyPrice: { fontSize: 16, fontWeight: '800', color: Colors.primary },
});

export default DashboardScreen;

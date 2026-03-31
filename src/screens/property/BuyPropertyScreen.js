import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Platform,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import PropertyCard, { normalizeProperty } from '../../components/PropertyCard';
import { PropertyCardSkeleton } from '../../components/SkeletonLoader';
import { getProperties, getPropertiesByAgent } from '../../api/propertyApi';
import { getDistricts, getAreas } from '../../api/districtApi';
import { ScrollView, TouchableOpacity } from 'react-native';

const BuyPropertyScreen = ({ navigation, route }) => {
    const initialAgentId = route.params?.agentId || null;
    const agentName = route.params?.agentName || null;

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeAgentId, setActiveAgentId] = useState(initialAgentId);
    const [districts, setDistricts] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            let listings = [];
            if (activeAgentId) {
                const response = await getPropertiesByAgent(activeAgentId);
                listings = response.data?.data || response.data || [];
            } else {
                const params = {
                    search: search || undefined,
                    district: selectedDistrict?._id || selectedDistrict?.id || undefined,
                    area: selectedArea?._id || selectedArea?.id || undefined
                };
                const response = await getProperties(params);
                listings = response.data?.data || response.data?.properties || response.data || [];
            }
            setProperties(Array.isArray(listings) ? listings.map(normalizeProperty) : []);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, [search, activeAgentId, selectedDistrict, selectedArea]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const [distRes, areaRes] = await Promise.all([getDistricts(), getAreas()]);
                setDistricts(distRes.data?.data || distRes.data?.districts || distRes.data || []);
                setAreas(areaRes.data?.data || areaRes.data?.areas || areaRes.data || []);
            } catch (err) {
                console.error('Location Load Error:', err);
            }
        };
        loadLocations();
    }, []);

    useEffect(() => {
        if (route.params?.agentId) setActiveAgentId(route.params.agentId);
    }, [route.params]);

    const filteredAreas = selectedDistrict
        ? areas.filter(a => (a.district?._id || a.district) === (selectedDistrict._id || selectedDistrict.id))
        : [];

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            <View style={styles.topBar}>
                <View style={styles.screenHeaderTitle}>
                    <Icon name="business" size={24} color={Colors.primary} />
                    <Text style={styles.screenTitle}>
                        {agentName ? `${agentName}'s Properties` : 'Properties'}
                    </Text>
                </View>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchBar}
                />

                {/* City/Area Selector */}
                {!activeAgentId && (
                    <View style={styles.selectorContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                            <TouchableOpacity
                                style={[styles.chip, !selectedDistrict && styles.chipActive]}
                                onPress={() => { setSelectedDistrict(null); setSelectedArea(null); }}
                            >
                                <Text style={[styles.chipText, !selectedDistrict && styles.chipTextActive]}>All Cities</Text>
                            </TouchableOpacity>
                            {districts.map(dist => (
                                <TouchableOpacity
                                    key={dist._id || dist.id}
                                    style={[styles.chip, selectedDistrict?._id === dist._id && styles.chipActive]}
                                    onPress={() => { setSelectedDistrict(dist); setSelectedArea(null); }}
                                >
                                    <Text style={[styles.chipText, selectedDistrict?._id === dist._id && styles.chipTextActive]}>{dist.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {selectedDistrict && filteredAreas.length > 0 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipScroll, { marginTop: 10 }]}>
                                <TouchableOpacity
                                    style={[styles.chip, !selectedArea && styles.chipActive]}
                                    onPress={() => setSelectedArea(null)}
                                >
                                    <Text style={[styles.chipText, !selectedArea && styles.chipTextActive]}>All Areas</Text>
                                </TouchableOpacity>
                                {filteredAreas.map(area => (
                                    <TouchableOpacity
                                        key={area._id || area.id}
                                        style={[styles.chip, selectedArea?._id === area._id && styles.chipActive]}
                                        onPress={() => setSelectedArea(area)}
                                    >
                                        <Text style={[styles.chipText, selectedArea?._id === area._id && styles.chipTextActive]}>{area.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                )}
            </View>

            {loading ? (
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <PropertyCardSkeleton />
                    <PropertyCardSkeleton />
                    <PropertyCardSkeleton />
                </ScrollView>
            ) : (
                <FlatList
                    data={properties}
                    renderItem={({ item, index }) => (
                        <View style={{ animationDuration: `${(index % 5 + 1) * 200}ms` }}>
                            <PropertyCard
                                property={item}
                                onPress={() => navigation.navigate('PropertyDetail', { property: item })}
                            />
                        </View>
                    )}
                    keyExtractor={(item, idx) => String(item._id || item.id || idx)}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text style={styles.resultCount}>
                            {properties.length} {properties.length === 1 ? 'premium property' : 'premium properties'} found
                        </Text>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="search-outline" size={56} color={Colors.textLight} />
                            <Text style={styles.emptyTitle}>No matching properties</Text>
                            <Text style={styles.emptyText}>Try adjusting your premium search criteria</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
    topBar: {
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 10,
        shadowColor: Colors.shadowPremium,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        marginBottom: 10,
    },
    screenHeaderTitle: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
    screenTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5 },
    searchBar: { marginBottom: 14 },
    selectorContainer: { marginTop: 6 },
    chipScroll: { paddingBottom: 6 },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: Colors.surfaceSecondary,
        marginRight: 12,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primaryDark,
        elevation: 4,
        shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
    },
    chipText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '700',
    },
    chipTextActive: {
        color: Colors.textWhite,
    },
    listContent: { padding: 20, paddingBottom: 100 },
    resultCount: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginBottom: 16 },
    emptyContainer: { alignItems: 'center', paddingVertical: 80 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginTop: 20, marginBottom: 8 },
    emptyText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
});

export default BuyPropertyScreen;

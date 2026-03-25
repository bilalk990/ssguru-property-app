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
import Loader from '../../components/Loader';
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
                <Loader message="Finding properties..." fullScreen={false} />
            ) : (
                <FlatList
                    data={properties}
                    renderItem={({ item }) => (
                        <PropertyCard
                            property={item}
                            onPress={() => navigation.navigate('PropertyDetail', { property: item })}
                        />
                    )}
                    keyExtractor={(item, idx) => String(item._id || item.id || idx)}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text style={styles.resultCount}>
                            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                        </Text>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="search-outline" size={50} color={Colors.textLight} />
                            <Text style={styles.emptyTitle}>No properties found</Text>
                            <Text style={styles.emptyText}>Try a different search term</Text>
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
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    screenHeaderTitle: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
    screenTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
    searchBar: { marginBottom: 12 },
    selectorContainer: { marginTop: 4 },
    chipScroll: { paddingBottom: 4 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.backgroundSecondary,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    chipTextActive: {
        color: Colors.textWhite,
    },
    listContent: { padding: 16, paddingBottom: 20 },
    resultCount: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
    emptyText: { fontSize: 14, color: Colors.textSecondary },
});

export default BuyPropertyScreen;

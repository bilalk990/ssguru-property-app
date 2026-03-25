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

const BuyPropertyScreen = ({ navigation, route }) => {
    const initialAgentId = route.params?.agentId || null;
    const agentName = route.params?.agentName || null;

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeAgentId, setActiveAgentId] = useState(initialAgentId);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            let listings = [];
            if (activeAgentId) {
                const response = await getPropertiesByAgent(activeAgentId);
                listings = response.data?.data || response.data || [];
            } else {
                const params = { search: search || undefined };
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
    }, [search, activeAgentId]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    useEffect(() => {
        if (route.params?.agentId) setActiveAgentId(route.params.agentId);
    }, [route.params]);

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
    searchBar: { marginBottom: 0 },
    listContent: { padding: 16, paddingBottom: 20 },
    resultCount: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
    emptyText: { fontSize: 14, color: Colors.textSecondary },
});

export default BuyPropertyScreen;

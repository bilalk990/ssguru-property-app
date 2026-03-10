import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    Modal,
    StatusBar,
} from 'react-native';
import Colors from '../../constants/colors';
import SearchBar from '../../components/SearchBar';
import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import { getProperties } from '../../api/propertyApi';
import { cities, propertyTypes, priceRanges } from '../../constants/dummyData';

const BuyPropertyScreen = ({ navigation }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [selectedType, setSelectedType] = useState('All Types');
    const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getProperties({
                search,
                city: selectedCity,
                type: selectedType,
                minPrice: selectedPrice.min,
                maxPrice: selectedPrice.max,
            });
            setProperties(response.data.properties);
        } catch (error) {
            console.log('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    }, [search, selectedCity, selectedType, selectedPrice]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const clearFilters = () => {
        setSelectedCity('All Cities');
        setSelectedType('All Types');
        setSelectedPrice(priceRanges[0]);
        setSearch('');
    };

    const hasActiveFilters =
        selectedCity !== 'All Cities' ||
        selectedType !== 'All Types' ||
        selectedPrice.label !== 'All Prices';

    const renderFilterModal = () => (
        <Modal
            visible={showFilter}
            animationType="slide"
            transparent
            onRequestClose={() => setShowFilter(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>⚡ Filters</Text>
                        <TouchableOpacity onPress={() => setShowFilter(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* City Filter */}
                    <Text style={styles.filterLabel}>City</Text>
                    <View style={styles.chipContainer}>
                        {cities.map(city => (
                            <TouchableOpacity
                                key={city}
                                style={[
                                    styles.chip,
                                    selectedCity === city && styles.chipActive,
                                ]}
                                onPress={() => setSelectedCity(city)}>
                                <Text
                                    style={[
                                        styles.chipText,
                                        selectedCity === city && styles.chipTextActive,
                                    ]}>
                                    {city}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Property Type */}
                    <Text style={styles.filterLabel}>Property Type</Text>
                    <View style={styles.chipContainer}>
                        {propertyTypes.map(type => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.chip,
                                    selectedType === type && styles.chipActive,
                                ]}
                                onPress={() => setSelectedType(type)}>
                                <Text
                                    style={[
                                        styles.chipText,
                                        selectedType === type && styles.chipTextActive,
                                    ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Price Range */}
                    <Text style={styles.filterLabel}>Price Range</Text>
                    <View style={styles.chipContainer}>
                        {priceRanges.map(range => (
                            <TouchableOpacity
                                key={range.label}
                                style={[
                                    styles.chip,
                                    selectedPrice.label === range.label && styles.chipActive,
                                ]}
                                onPress={() => setSelectedPrice(range)}>
                                <Text
                                    style={[
                                        styles.chipText,
                                        selectedPrice.label === range.label &&
                                        styles.chipTextActive,
                                    ]}>
                                    {range.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Actions */}
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearFilters}>
                            <Text style={styles.clearButtonText}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setShowFilter(false)}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderHeader = () => (
        <View style={styles.listHeader}>
            {hasActiveFilters && (
                <View style={styles.activeFilters}>
                    {selectedCity !== 'All Cities' && (
                        <View style={styles.activeChip}>
                            <Text style={styles.activeChipText}>📍 {selectedCity}</Text>
                            <TouchableOpacity
                                onPress={() => setSelectedCity('All Cities')}>
                                <Text style={styles.removeChip}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {selectedType !== 'All Types' && (
                        <View style={styles.activeChip}>
                            <Text style={styles.activeChipText}>🏠 {selectedType}</Text>
                            <TouchableOpacity
                                onPress={() => setSelectedType('All Types')}>
                                <Text style={styles.removeChip}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {selectedPrice.label !== 'All Prices' && (
                        <View style={styles.activeChip}>
                            <Text style={styles.activeChipText}>
                                💰 {selectedPrice.label}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setSelectedPrice(priceRanges[0])}>
                                <Text style={styles.removeChip}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
            <Text style={styles.resultCount}>
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.screenTitle}>🏠 Properties</Text>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    onFilterPress={() => setShowFilter(true)}
                    style={styles.searchBar}
                />
            </View>

            {/* Property List */}
            {loading ? (
                <Loader message="Finding properties..." fullScreen={false} />
            ) : (
                <FlatList
                    data={properties}
                    renderItem={({ item }) => (
                        <PropertyCard
                            property={item}
                            onPress={() =>
                                navigation.navigate('PropertyDetail', { property: item })
                            }
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>🔍</Text>
                            <Text style={styles.emptyTitle}>No properties found</Text>
                            <Text style={styles.emptyText}>
                                Try adjusting your search or filters
                            </Text>
                            <TouchableOpacity onPress={clearFilters}>
                                <Text style={styles.clearFiltersText}>Clear all filters</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            {renderFilterModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
    },
    topBar: {
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 14,
    },
    searchBar: {
        marginBottom: 0,
    },
    listContent: {
        padding: 16,
    },
    listHeader: {
        marginBottom: 8,
    },
    activeFilters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    activeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primarySoft,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    activeChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
    },
    removeChip: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '700',
    },
    resultCount: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
        marginBottom: 8,
    },
    // Filter Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    closeButton: {
        fontSize: 22,
        color: Colors.textSecondary,
        padding: 4,
    },
    filterLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 10,
        marginTop: 6,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.backgroundSecondary,
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
        fontWeight: '500',
    },
    chipTextActive: {
        color: Colors.textWhite,
        fontWeight: '600',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    clearButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    clearButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        elevation: 2,
    },
    applyButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textWhite,
    },
    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyEmoji: {
        fontSize: 50,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 16,
    },
    clearFiltersText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primary,
    },
});

export default BuyPropertyScreen;

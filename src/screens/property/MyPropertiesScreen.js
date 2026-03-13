import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    StatusBar,
    Platform,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import Loader from '../../components/Loader';
import { getMyProperties, deleteProperty } from '../../api/propertyApi';

const MyPropertiesScreen = ({ navigation }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyProperties = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMyProperties();
            setProperties(response.data.properties);
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyProperties();
    }, [fetchMyProperties]);

    const handleDelete = id => {
        Alert.alert(
            'Delete Property',
            'Are you sure you want to delete this listing?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProperty(id);
                            setProperties(prev => prev.filter(p => p.id !== id));
                            Alert.alert('Deleted', 'Property has been removed.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete property.');
                        }
                    },
                },
            ],
        );
    };

    const renderProperty = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.images[0] }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Active</Text>
                    </View>
                </View>
                <Text style={styles.price}>{item.price}</Text>
                <View style={styles.locationRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText}>
                        {item.area}, {item.city}
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            navigation.navigate('PropertyDetail', { property: item })
                        }>
                        <Icon name="eye-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.actionText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editAction]}>
                        <Icon name="create-outline" size={16} color={Colors.primary} />
                        <Text style={[styles.actionText, styles.editText]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteAction]}
                        onPress={() => handleDelete(item.id)}>
                        <Icon name="trash-outline" size={16} color={Colors.error} />
                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Properties</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddProperty')}>
                    <Icon name="add" size={28} color={Colors.textWhite} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <Loader message="Loading your properties..." fullScreen={false} />
            ) : (
                <FlatList
                    data={properties}
                    renderItem={renderProperty}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconBox}>
                                <Icon name="business-outline" size={60} color={Colors.primarySoft} />
                            </View>
                            <Text style={styles.emptyTitle}>No properties listed</Text>
                            <Text style={styles.emptyText}>
                                Start listing your properties to reach thousands of buyers
                            </Text>
                            <TouchableOpacity
                                style={styles.addFirstButton}
                                onPress={() => navigation.navigate('AddProperty')}>
                                <Text style={styles.addFirstText}>+ Add Your First Property</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 16,
        paddingBottom: 16,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    backIcon: {
        fontSize: 22,
        color: Colors.textPrimary,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: 24,
        color: Colors.textWhite,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    // Card
    card: {
        backgroundColor: Colors.backgroundCard,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 3,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    image: {
        width: '100%',
        height: 160,
        backgroundColor: Colors.borderLight,
    },
    cardContent: {
        padding: 14,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        backgroundColor: Colors.primarySoft,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.primary,
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.primary,
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    locationIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    locationText: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: Colors.backgroundSecondary,
        gap: 4,
    },
    editAction: {
        backgroundColor: Colors.primarySoft,
    },
    deleteAction: {
        backgroundColor: '#FFEBEE',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    editText: {
        color: Colors.primary,
    },
    deleteText: {
        color: Colors.error,
    },
    viewIcon: { fontSize: 14 },
    editIcon: { fontSize: 14 },
    deleteIcon: { fontSize: 14 },
    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyIconBox: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.surfaceSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 40,
    },
    addFirstButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
    },
    addFirstText: {
        color: Colors.textWhite,
        fontWeight: '700',
        fontSize: 14,
    },
});

export default MyPropertiesScreen;

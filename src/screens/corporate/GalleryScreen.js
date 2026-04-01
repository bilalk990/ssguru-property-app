import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { getProperties } from '../../api/propertyApi';

const { width } = Dimensions.get('window');
const columnWidth = (width - 50) / 2;

const GalleryScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await getProperties({ featured: true });
                const props = res.data?.data || res.data?.properties || res.data || [];
                // Extract images from properties
                const galleryItems = props.map(p => ({
                    id: p.id || p._id,
                    image: p.images?.[0]?.url || p.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000',
                    title: p.title,
                    property: p,
                }));
                setImages(galleryItems);
            } catch (e) {
                console.error('Gallery Fetch Error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.galleryItem}
            onPress={() => navigation.navigate('PropertyDetail', { property: item.property })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.imageTitle} numberOfLines={1}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('corporate.premiumGallery')}</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item, idx) => String(item.id || item._id || idx)}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: Colors.textSecondary }}>{t('corporate.noGallery')}</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    listContent: { padding: 20 },
    galleryItem: {
        width: columnWidth,
        marginBottom: 20,
        marginHorizontal: 5,
        backgroundColor: Colors.background,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    image: { width: '100%', height: 180, resizeMode: 'cover' },
    imageTitle: { padding: 10, fontSize: 13, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
});

export default GalleryScreen;

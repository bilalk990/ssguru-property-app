import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
    Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

const PLACEHOLDER = 'https://via.placeholder.com/300';

// Safely get image URI from property
const getImageUri = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
        console.log('PropertyCard: No images array found');
        return PLACEHOLDER;
    }
    const first = images[0];
    if (typeof first === 'string') {
        console.log('PropertyCard: Image is string:', first);
        return first || PLACEHOLDER;
    }
    if (first && typeof first === 'object') {
        const uri = first.url || first.secure_url || PLACEHOLDER;
        console.log('PropertyCard: Image is object, extracted URI:', uri);
        return uri;
    }
    console.log('PropertyCard: Unknown image format:', first);
    return PLACEHOLDER;
};

// Normalize backend property fields to what UI expects
export const normalizeProperty = (item) => {
    if (!item || typeof item !== 'object') {
        console.warn('normalizeProperty received invalid item:', item);
        return {
            _id: String(Math.random()),
            title: 'Invalid Property',
            type: 'Property',
            city: '',
            area: '',
            price: 'Price on request',
            sqft: '',
            bedrooms: 0,
            bathrooms: 0,
            featured: false,
            postedDate: '',
            images: [],
            agentPhone: '',
            agentAvatar: '',
            videoUrl: '',
        };
    }
    
    return {
        ...item,
        _id: item._id || item.id || String(Math.random()),
        title: item.title || 'Untitled Property',
        type: item.type || item.category || item.sellingType || 'Property',
        city: item.city || (typeof item.district === 'object' ? item.district?.name : '') || (typeof item.district === 'string' && item.district.length < 30 ? item.district : '') || '',
        area: item.area?.name || item.area || '',
        price: item.price
            ? (typeof item.price === 'string' && item.price.startsWith('PKR')
                ? item.price
                : `PKR ${Number(item.price).toLocaleString()}`)
            : 'Price on request',
        sqft: item.sqft
            ? (typeof item.sqft === 'string' && item.sqft.includes('sqft') ? item.sqft : `${item.sqft} sqft`)
            : (item.areaSize ? `${item.areaSize} sqft` : ''),
        bedrooms: item.bedrooms || 0,
        bathrooms: item.bathrooms || 0,
        featured: item.featured || item.isFeatured || false,
        postedDate: item.postedDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''),
        images: item.images || [],
        // Agent info - backend has contactNumber on property and contact on agent
        agentPhone: item.contactNumber || (typeof item.agent === 'object' ? item.agent?.contact || item.agent?.phone : '') || item.agentPhone || '',
        agentAvatar: item.agentAvatar || (typeof item.agent === 'object' ? item.agent?.avatar : '') || '',
        agentName: typeof item.agent === 'object' ? item.agent?.name : (item.agent || 'Agent'),
        videoUrl: item.videoUrl || item.video || '',
    };
};

const PropertyCard = ({ property: rawProperty, onPress, style, horizontal = false }) => {
    const property = normalizeProperty(rawProperty);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const imageUri = getImageUri(property.images);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
    };

    if (horizontal) {
        return (
            <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
                <Animated.View style={[styles.horizontalCard, style, { transform: [{ scale: scaleAnim }] }]}>
                    <Image source={{ uri: imageUri }} style={styles.horizontalImage} resizeMode="cover" />
                    <View style={styles.horizontalBadge}>
                        <Text style={styles.badgeText}>{property.type}</Text>
                    </View>
                    <View style={styles.horizontalContent}>
                        <Text style={styles.horizontalTitle} numberOfLines={1}>{property.title}</Text>
                        <View style={styles.locationRow}>
                            <Icon name="location-outline" size={12} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                            <Text style={styles.locationText} numberOfLines={1}>
                                {[property.area, property.city].filter(Boolean).join(', ') || 'Location N/A'}
                            </Text>
                        </View>
                        <View style={styles.horizontalFooter}>
                            <Text style={styles.price}>{property.price}</Text>
                            {!!property.sqft && (
                                <View style={styles.sqftBadge}>
                                    <Text style={styles.sqftText}>{property.sqft}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
            <Animated.View style={[styles.card, style, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{property.type}</Text>
                    </View>
                    {property.featured && (
                        <View style={styles.featuredBadge}>
                            <Icon name="star" size={10} color={Colors.textWhite} style={{ marginRight: 4 }} />
                            <Text style={styles.featuredText}>Featured</Text>
                        </View>
                    )}
                </View>
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={2}>{property.title}</Text>
                    <View style={styles.locationRow}>
                        <Icon name="location-outline" size={14} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={styles.locationText} numberOfLines={1}>
                            {[property.area, property.city].filter(Boolean).join(', ') || 'Location N/A'}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        {!!property.sqft && (
                            <View style={styles.infoItem}>
                                <Icon name="resize-outline" size={14} color={Colors.textSecondary} />
                                <Text style={styles.infoText}>{property.sqft}</Text>
                            </View>
                        )}
                        {property.type && (
                            <View style={styles.infoItem}>
                                <Icon name="pricetag-outline" size={14} color={Colors.textSecondary} />
                                <Text style={styles.infoText}>{property.type}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.price}>{property.price}</Text>
                        <Text style={styles.dateText}>{property.postedDate}</Text>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.backgroundCard,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: Colors.shadowDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    imageContainer: { position: 'relative' },
    image: { width: '100%', height: 200, backgroundColor: Colors.borderLight },
    badge: {
        position: 'absolute', top: 12, left: 12,
        backgroundColor: Colors.primary,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    },
    badgeText: { color: Colors.textWhite, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    featuredBadge: {
        position: 'absolute', top: 12, right: 12,
        backgroundColor: Colors.accent,
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
        flexDirection: 'row', alignItems: 'center',
    },
    featuredText: { color: Colors.textWhite, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    content: { padding: 14 },
    title: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6, lineHeight: 22 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    locationText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 14 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    infoText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
    footer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 10,
    },
    price: { fontSize: 17, fontWeight: '800', color: Colors.primary },
    dateText: { fontSize: 12, color: Colors.textLight },
    // Horizontal
    horizontalCard: {
        width: CARD_WIDTH, backgroundColor: Colors.backgroundCard,
        borderRadius: 14, marginRight: 14, overflow: 'hidden',
        elevation: 3, shadowColor: Colors.shadowDark,
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6,
    },
    horizontalImage: { width: '100%', height: 120, backgroundColor: Colors.borderLight },
    horizontalBadge: {
        position: 'absolute', top: 8, left: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    },
    horizontalContent: { padding: 10 },
    horizontalTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
    horizontalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
    sqftBadge: { backgroundColor: Colors.primarySoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    sqftText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
});

export default PropertyCard;

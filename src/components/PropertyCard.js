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
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

const PropertyCard = ({ property, onPress, style, horizontal = false }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    if (horizontal) {
        return (
            <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}>
                <Animated.View style={[styles.horizontalCard, style, { transform: [{ scale: scaleAnim }] }]}>
                    <Image
                        source={{ uri: property.images[0] }}
                        style={styles.horizontalImage}
                        resizeMode="cover"
                    />
                    <View style={styles.horizontalBadge}>
                        <Text style={styles.badgeText}>{property.type}</Text>
                    </View>
                    <View style={styles.horizontalContent}>
                        <Text style={styles.horizontalTitle} numberOfLines={1}>
                            {property.title}
                        </Text>
                        <View style={styles.locationRow}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <Text style={styles.locationText} numberOfLines={1}>
                                {property.area}, {property.city}
                            </Text>
                        </View>
                        <View style={styles.horizontalFooter}>
                            <Text style={styles.price}>{property.price}</Text>
                            <View style={styles.sqftBadge}>
                                <Text style={styles.sqftText}>{property.sqft}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}>
            <Animated.View style={[styles.card, style, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: property.images[0] }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{property.type}</Text>
                    </View>
                    {property.featured && (
                        <View style={styles.featuredBadge}>
                            <Text style={styles.featuredText}>⭐ Featured</Text>
                        </View>
                    )}
                </View>
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={2}>
                        {property.title}
                    </Text>
                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText} numberOfLines={1}>
                            {property.area}, {property.city}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        {property.bedrooms > 0 && (
                            <View style={styles.infoItem}>
                                <Text style={styles.infoIcon}>🛏️</Text>
                                <Text style={styles.infoText}>{property.bedrooms}</Text>
                            </View>
                        )}
                        {property.bathrooms > 0 && (
                            <View style={styles.infoItem}>
                                <Text style={styles.infoIcon}>🚿</Text>
                                <Text style={styles.infoText}>{property.bathrooms}</Text>
                            </View>
                        )}
                        <View style={styles.infoItem}>
                            <Text style={styles.infoIcon}>📐</Text>
                            <Text style={styles.infoText}>{property.sqft}</Text>
                        </View>
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
    // Vertical Card
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
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: Colors.borderLight,
    },
    badge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: Colors.textWhite,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    featuredBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: Colors.accentLight,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    featuredText: {
        color: Colors.textWhite,
        fontSize: 11,
        fontWeight: '700',
    },
    content: {
        padding: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 6,
        lineHeight: 22,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    locationIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    locationText: {
        fontSize: 13,
        color: Colors.textSecondary,
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 14,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    infoIcon: {
        fontSize: 13,
    },
    infoText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: 10,
    },
    price: {
        fontSize: 17,
        fontWeight: '800',
        color: Colors.primary,
    },
    dateText: {
        fontSize: 12,
        color: Colors.textLight,
    },

    // Horizontal Card (for featured carousel)
    horizontalCard: {
        width: CARD_WIDTH,
        backgroundColor: Colors.backgroundCard,
        borderRadius: 14,
        marginRight: 14,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: Colors.shadowDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    horizontalImage: {
        width: '100%',
        height: 120,
        backgroundColor: Colors.borderLight,
    },
    horizontalBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    horizontalContent: {
        padding: 10,
    },
    horizontalTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    horizontalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    sqftBadge: {
        backgroundColor: Colors.primarySoft,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sqftText: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '600',
    },
});

export default PropertyCard;

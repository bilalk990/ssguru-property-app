import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Linking,
    Platform,
} from 'react-native';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';

const { width } = Dimensions.get('window');

const PropertyDetailScreen = ({ route, navigation }) => {
    const { property } = route.params;
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleCall = () => {
        Linking.openURL(`tel:${property.agentPhone}`);
    };

    const handleWhatsApp = () => {
        const message = `Hi, I'm interested in the property: ${property.title} (${property.price})`;
        Linking.openURL(
            `whatsapp://send?phone=${property.agentPhone.replace(/\s/g, '')}&text=${encodeURIComponent(message)}`,
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                <View style={styles.imageSection}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={e => {
                            const index = Math.round(
                                e.nativeEvent.contentOffset.x / width,
                            );
                            setActiveImageIndex(index);
                        }}>
                        {property.images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={styles.propertyImage}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>

                    {/* Image Dots */}
                    <View style={styles.dotContainer}>
                        {property.images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeImageIndex === index && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Image Counter */}
                    <View style={styles.imageCounter}>
                        <Text style={styles.imageCounterText}>
                            {activeImageIndex + 1}/{property.images.length}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Price & Type */}
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{property.price}</Text>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>{property.type}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{property.title}</Text>

                    {/* Location */}
                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText}>
                            {property.area}, {property.city}
                        </Text>
                    </View>

                    {/* Quick Info */}
                    <View style={styles.infoGrid}>
                        {property.bedrooms > 0 && (
                            <View style={styles.infoBox}>
                                <Text style={styles.infoBoxIcon}>🛏️</Text>
                                <Text style={styles.infoBoxValue}>{property.bedrooms}</Text>
                                <Text style={styles.infoBoxLabel}>Bedrooms</Text>
                            </View>
                        )}
                        {property.bathrooms > 0 && (
                            <View style={styles.infoBox}>
                                <Text style={styles.infoBoxIcon}>🚿</Text>
                                <Text style={styles.infoBoxValue}>{property.bathrooms}</Text>
                                <Text style={styles.infoBoxLabel}>Bathrooms</Text>
                            </View>
                        )}
                        <View style={styles.infoBox}>
                            <Text style={styles.infoBoxIcon}>📐</Text>
                            <Text style={styles.infoBoxValue}>{property.sqft}</Text>
                            <Text style={styles.infoBoxLabel}>Area</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📄 Description</Text>
                        <Text style={styles.description}>{property.description}</Text>
                    </View>

                    {/* Agent Info */}
                    <View style={styles.agentCard}>
                        <View style={styles.agentInfo}>
                            <View style={styles.agentAvatar}>
                                <Text style={styles.agentInitial}>
                                    {property.agent.charAt(0)}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.agentName}>{property.agent}</Text>
                                <Text style={styles.agentLabel}>Property Agent</Text>
                            </View>
                        </View>
                    </View>

                    {/* Posted Date */}
                    <View style={styles.postedRow}>
                        <Text style={styles.postedIcon}>🕐</Text>
                        <Text style={styles.postedText}>
                            Posted {property.postedDate}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <CustomButton
                    title="Call Agent"
                    onPress={handleCall}
                    variant="outline"
                    icon="📞"
                    style={styles.callButton}
                />
                <CustomButton
                    title="WhatsApp"
                    onPress={handleWhatsApp}
                    icon="💬"
                    style={styles.whatsappButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    // Image Section
    imageSection: {
        position: 'relative',
    },
    propertyImage: {
        width,
        height: 320,
        backgroundColor: Colors.borderLight,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 54 : 20,
        left: 16,
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 22,
        color: Colors.textWhite,
    },
    dotContainer: {
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    dotActive: {
        backgroundColor: Colors.textWhite,
        width: 24,
    },
    imageCounter: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    imageCounterText: {
        color: Colors.textWhite,
        fontSize: 12,
        fontWeight: '600',
    },
    // Content
    content: {
        padding: 20,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.primary,
    },
    typeBadge: {
        backgroundColor: Colors.primarySoft,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 10,
    },
    typeBadgeText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 13,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 10,
        lineHeight: 30,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    locationText: {
        fontSize: 15,
        color: Colors.textSecondary,
    },
    // Info Grid
    infoGrid: {
        flexDirection: 'row',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 16,
        padding: 16,
        gap: 12,
        marginBottom: 24,
    },
    infoBox: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.backgroundCard,
        borderRadius: 12,
    },
    infoBoxIcon: {
        fontSize: 22,
        marginBottom: 6,
    },
    infoBoxValue: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    infoBoxLabel: {
        fontSize: 11,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    // Description
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    // Agent Card
    agentCard: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    agentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    agentAvatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    agentInitial: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textWhite,
    },
    agentName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    agentLabel: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    // Posted
    postedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 80,
    },
    postedIcon: {
        fontSize: 14,
    },
    postedText: {
        fontSize: 13,
        color: Colors.textLight,
    },
    // Bottom Bar
    bottomBar: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        gap: 12,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    callButton: {
        flex: 1,
    },
    whatsappButton: {
        flex: 1,
    },
});

export default PropertyDetailScreen;

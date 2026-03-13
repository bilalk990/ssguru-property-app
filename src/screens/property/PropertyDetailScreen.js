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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import CustomButton from '../../components/CustomButton';

const { width, height } = Dimensions.get('window');

const PropertyDetailScreen = ({ route, navigation }) => {
    const { property } = route.params;
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleCall = () => {
        Linking.openURL(`tel:${property.agentPhone || '1234567890'}`);
    };

    const handleWhatsApp = () => {
        const message = `Hi, I'm interested in the property: ${property.title} (${property.price})`;
        const phone = property.agentPhone ? property.agentPhone.replace(/\s/g, '') : '1234567890';
        Linking.openURL(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`);
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Section */}
                <View style={styles.imageSection}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={e => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
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

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.imageGradient}
                    />

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color={Colors.textWhite} />
                    </TouchableOpacity>

                    {/* Image Counter Badge */}
                    <View style={styles.imageCounter}>
                        <Icon name="images-outline" size={14} color={Colors.textWhite} />
                        <Text style={styles.imageCounterText}>
                            {activeImageIndex + 1}/{property.images.length}
                        </Text>
                    </View>

                    {/* Price Header inside Image */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>{property.price}</Text>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>{property.type}</Text>
                        </View>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{property.title}</Text>

                    <View style={styles.locationWrapper}>
                        <Icon name="location-outline" size={16} color={Colors.primary} />
                        <Text style={styles.locationText}>
                            {property.area}, {property.city}
                        </Text>
                    </View>

                    {/* Elite Info Grid */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconBox}>
                                <Icon name="bed-outline" size={22} color={Colors.primary} />
                            </View>
                            <Text style={styles.infoValue}>{property.bedrooms || 0}</Text>
                            <Text style={styles.infoLabel}>Beds</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconBox}>
                                <Icon name="water-outline" size={22} color={Colors.primary} />
                            </View>
                            <Text style={styles.infoValue}>{property.bathrooms || 0}</Text>
                            <Text style={styles.infoLabel}>Baths</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconBox}>
                                <Icon name="expand-outline" size={22} color={Colors.primary} />
                            </View>
                            <Text style={styles.infoValue}>{property.sqft || '-'}</Text>
                            <Text style={styles.infoLabel}>Sq.Ft</Text>
                        </View>
                    </View>

                    {/* Description Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <Text style={styles.descriptionText}>{property.description}</Text>
                    </View>

                    {/* Luxury Agent Card */}
                    <View style={styles.agentCard}>
                        <View style={styles.agentInfo}>
                            <View style={styles.avatarWrapper}>
                                <Image
                                    source={{ uri: property.agentAvatar || 'https://i.pravatar.cc/150' }}
                                    style={styles.avatar}
                                />
                                <View style={styles.verifiedBadge}>
                                    <Icon name="checkmark-sharp" size={10} color={Colors.textWhite} />
                                </View>
                            </View>
                            <View style={styles.agentTextContainer}>
                                <Text style={styles.agentName}>{property.agent}</Text>
                                <Text style={styles.agentRole}>Elite Property Consultant</Text>
                            </View>
                            <TouchableOpacity style={styles.miniCall} onPress={handleCall}>
                                <Icon name="call" size={20} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.dateRow}>
                        <Icon name="time-outline" size={14} color={Colors.textLight} />
                        <Text style={styles.dateText}>Listed {property.postedDate || 'Just now'}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Premium Action Bar */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.callActionButton} onPress={handleCall}>
                    <Icon name="call" size={20} color={Colors.primary} />
                    <Text style={styles.callLabel}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.whatsappActionButton} onPress={handleWhatsApp}>
                    <LinearGradient
                        colors={[Colors.primary, '#1B5E20']}
                        style={styles.whatsappGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <Icon name="logo-whatsapp" size={20} color={Colors.textWhite} />
                        <Text style={styles.whatsappLabel}>Contact Agent</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    // Image Section
    imageSection: {
        height: height * 0.55,
        backgroundColor: Colors.border,
    },
    propertyImage: {
        width,
        height: '100%',
    },
    imageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 50,
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    imageCounter: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    imageCounterText: {
        color: Colors.textWhite,
        fontSize: 12,
        fontWeight: '700',
    },
    priceContainer: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.textWhite,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    typeBadge: {
        backgroundColor: Colors.accentMuted,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 12,
    },
    typeBadgeText: {
        color: Colors.textWhite,
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Content
    content: {
        marginTop: -20,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        backgroundColor: Colors.background,
        padding: 30,
        paddingTop: 35,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 12,
        lineHeight: 34,
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 30,
    },
    locationText: {
        fontSize: 15,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    // Elite Grid
    infoGrid: {
        flexDirection: 'row',
        backgroundColor: Colors.surfaceSecondary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 35,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    infoIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(27, 94, 32, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
    },
    infoDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    // Description
    section: {
        marginBottom: 35,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 15,
    },
    descriptionText: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 26,
    },
    // Agent Card
    agentCard: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    agentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 18,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.textWhite,
    },
    agentTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    agentName: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    agentRole: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    miniCall: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingLeft: 4,
    },
    dateText: {
        fontSize: 13,
        color: Colors.textLight,
        fontWeight: '500',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 35 : 20,
        flexDirection: 'row',
        gap: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    callActionButton: {
        width: 60,
        height: 60,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surfaceSecondary,
    },
    callLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: 2,
    },
    whatsappActionButton: {
        flex: 1,
        height: 60,
    },
    whatsappGradient: {
        flex: 1,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    whatsappLabel: {
        color: Colors.textWhite,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default PropertyDetailScreen;


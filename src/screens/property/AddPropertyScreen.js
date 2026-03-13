import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    StatusBar,
    Platform,
    Image,
} from 'react-native';
import Colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import { addProperty } from '../../api/propertyApi';
import { propertyTypes } from '../../constants/dummyData';

const AddPropertyScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        title: '',
        price: '',
        city: '',
        area: '',
        description: '',
        type: 'Apartment',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePickImage = () => {
        // Simulate adding an image
        const dummyImage = `https://picsum.photos/400/300?random=${Date.now()}`;
        setImages(prev => [...prev, dummyImage]);
    };

    const removeImage = index => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validation
        if (!form.title || !form.price || !form.city || !form.area || !form.description) {
            Alert.alert('Missing Fields', 'Please fill all required fields.');
            return;
        }
        if (images.length === 0) {
            Alert.alert('No Images', 'Please add at least one property image.');
            return;
        }

        setLoading(true);
        try {
            await addProperty({ ...form, images });
            Alert.alert(
                'Success! 🎉',
                'Your property has been listed successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ],
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to list property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const types = propertyTypes.filter(t => t !== 'All Types');

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
                <Text style={styles.headerTitle}>List Your Property</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                {/* Payment Notice */}
                <View style={styles.paymentNotice}>
                    <Icon name="card-outline" size={32} color={Colors.accent} />
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>Listing Fee: ₹20</Text>
                        <Text style={styles.paymentDesc}>
                            One-time payment to publish your property
                        </Text>
                    </View>
                </View>

                {/* Image Upload */}
                <Text style={styles.sectionLabel}>Property Images *</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageScroll}>
                    <TouchableOpacity
                        style={styles.addImageButton}
                        onPress={handlePickImage}>
                        <Icon name="camera-outline" size={28} color={Colors.primary} />
                        <Text style={styles.addImageText}>Add Photo</Text>
                    </TouchableOpacity>
                    {images.map((img, index) => (
                        <View key={index} style={styles.imagePreview}>
                            <Image source={{ uri: img }} style={styles.previewImage} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => removeImage(index)}>
                                <Icon name="close" size={16} color={Colors.textWhite} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                {/* Form Fields */}
                <Text style={styles.sectionLabel}>Property Title *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 3 BHK Luxury Apartment"
                    placeholderTextColor={Colors.textLight}
                    value={form.title}
                    onChangeText={v => updateField('title', v)}
                />

                {/* Property Type */}
                <Text style={styles.sectionLabel}>Property Type *</Text>
                <View style={styles.typeContainer}>
                    {types.map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.typeChip,
                                form.type === type && styles.typeChipActive,
                            ]}
                            onPress={() => updateField('type', type)}>
                            <Text
                                style={[
                                    styles.typeChipText,
                                    form.type === type && styles.typeChipTextActive,
                                ]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Price (₹) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 4500000"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="numeric"
                    value={form.price}
                    onChangeText={v => updateField('price', v)}
                />

                {/* Two column */}
                <View style={styles.twoColumn}>
                    <View style={styles.halfField}>
                        <Text style={styles.sectionLabel}>City *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Delhi"
                            placeholderTextColor={Colors.textLight}
                            value={form.city}
                            onChangeText={v => updateField('city', v)}
                        />
                    </View>
                    <View style={styles.halfField}>
                        <Text style={styles.sectionLabel}>Area *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Dwarka"
                            placeholderTextColor={Colors.textLight}
                            value={form.area}
                            onChangeText={v => updateField('area', v)}
                        />
                    </View>
                </View>

                {/* Three column */}
                <View style={styles.threeColumn}>
                    <View style={styles.thirdField}>
                        <Text style={styles.sectionLabel}>Bedrooms</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="3"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="numeric"
                            value={form.bedrooms}
                            onChangeText={v => updateField('bedrooms', v)}
                        />
                    </View>
                    <View style={styles.thirdField}>
                        <Text style={styles.sectionLabel}>Bathrooms</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="2"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="numeric"
                            value={form.bathrooms}
                            onChangeText={v => updateField('bathrooms', v)}
                        />
                    </View>
                    <View style={styles.thirdField}>
                        <Text style={styles.sectionLabel}>Area (sq.ft)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1500"
                            placeholderTextColor={Colors.textLight}
                            keyboardType="numeric"
                            value={form.sqft}
                            onChangeText={v => updateField('sqft', v)}
                        />
                    </View>
                </View>

                <Text style={styles.sectionLabel}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your property in detail..."
                    placeholderTextColor={Colors.textLight}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    value={form.description}
                    onChangeText={v => updateField('description', v)}
                />

                {/* Submit */}
                <CustomButton
                    title="Pay ₹20 & List Property"
                    onPress={handleSubmit}
                    loading={loading}
                    size="large"
                    icon="rocket-outline"
                    style={styles.submitButton}
                />

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 16,
        paddingBottom: 16,
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
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    paymentNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.accentSoft,
        borderRadius: 14,
        padding: 14,
        marginBottom: 20,
        gap: 12,
    },
    paymentEmoji: {
        fontSize: 28,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.accent,
    },
    paymentDesc: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
        marginTop: 4,
    },
    input: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 16,
    },
    textArea: {
        height: 120,
        paddingTop: 14,
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    typeChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: Colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    typeChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeChipText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    typeChipTextActive: {
        color: Colors.textWhite,
        fontWeight: '600',
    },
    twoColumn: {
        flexDirection: 'row',
        gap: 12,
    },
    halfField: {
        flex: 1,
    },
    threeColumn: {
        flexDirection: 'row',
        gap: 10,
    },
    thirdField: {
        flex: 1,
    },
    imageScroll: {
        marginBottom: 20,
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: Colors.primarySoft,
    },
    addImageIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    addImageText: {
        fontSize: 11,
        color: Colors.primary,
        fontWeight: '600',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 14,
        marginRight: 12,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: Colors.textWhite,
        fontSize: 12,
        fontWeight: '700',
    },
    submitButton: {
        marginTop: 8,
    },
});

export default AddPropertyScreen;

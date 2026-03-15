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
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from '../../components/CustomButton';
import { addProperty, updateProperty } from '../../api/propertyApi';
import { getDistricts, getAreas } from '../../api/districtApi';
import { propertyTypes } from '../../constants/appConstants';

const AddPropertyScreen = ({ navigation, route }) => {
    const editMode = route.params?.editMode || false;
    const propertyData = route.params?.propertyData || null;

    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        title: propertyData?.title || '',
        price: propertyData?.price?.toString() || '',
        city: propertyData?.city || 'Ujjain',
        area: propertyData?.area || '',
        description: propertyData?.description || '',
        type: propertyData?.type || 'Residential',
        category: propertyData?.category || 'House',
        sellingType: propertyData?.sellingType || 'Sell',
        bedrooms: propertyData?.bedrooms?.toString() || '',
        bathrooms: propertyData?.bathrooms?.toString() || '',
        sqft: propertyData?.sqft?.toString() || '',
        features: propertyData?.features || [],
    });
    const [images, setImages] = useState(propertyData?.images || []);
    const [video, setVideo] = useState(propertyData?.video || null);
    const [loading, setLoading] = useState(false);
    const [newFeature, setNewFeature] = useState('');

    // Dynamic Location States
    const [districts, setDistricts] = useState([]);
    const [areas, setAreas] = useState([]); // This state is still here but not used in the provided diff for step 3. Keeping it for now.
    const [locLoading, setLocLoading] = useState(false); // This state is still here but not used in the provided diff for step 3. Keeping it for now.

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const res = await getDistricts();
                setDistricts(res.data?.districts || res.data || []);
            } catch (e) {
                console.error('AddProperty Init Error:', e);
            }
        };
        loadInitialData();
    }, []);

    // handleDistrictChange and related logic removed as per instruction implying removal of area selection based on district.
    // If area selection is still needed, this function would need to be re-added and adapted.

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setForm(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
            setNewFeature('');
        }
    };

    const removeFeature = (idx) => {
        setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handlePickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 4 - images.length,
            quality: 0.8,
        });

        if (result.assets) {
            const newImages = result.assets.map(asset => asset.uri);
            setImages(prev => [...prev, ...newImages].slice(0, 4));
        }
    };

    const handlePickVideo = async () => {
        const result = await launchImageLibrary({
            mediaType: 'video',
            selectionLimit: 1,
        });

        if (result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            if (asset.fileSize > 30 * 1024 * 1024) {
                Alert.alert('File too large', 'Video must be under 30MB');
                return;
            }
            setVideo(asset.uri);
        }
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
            const formData = new FormData();

            // Append basic info
            Object.keys(form).forEach(key => {
                if (key === 'features') {
                    formData.append(key, JSON.stringify(form[key]));
                } else if (form[key]) {
                    formData.append(key, form[key].toString());
                }
            });

            // Append images
            images.forEach((uri, index) => {
                const fileName = `property_img_${Date.now()}_${index}.jpg`;
                formData.append('images', {
                    uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                    type: 'image/jpeg',
                    name: fileName,
                });
            });

            // Append video if exists
            if (video) {
                formData.append('video', {
                    uri: Platform.OS === 'android' ? video : video.replace('file://', ''),
                    type: 'video/mp4',
                    name: `property_video_${Date.now()}.mp4`,
                });
            }

            if (editMode) {
                await updateProperty(propertyData.id || propertyData._id, formData);
            } else {
                await addProperty(formData);
            }

            Alert.alert(
                'Success! 🎉',
                editMode ? 'Your property has been updated.' : 'Your property has been listed successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ],
            );
        } catch (error) {
            console.error('Add Property Error:', error);
            Alert.alert(
                'Submission Failed',
                error?.response?.data?.message || 'Failed to list property. Please try again.'
            );
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
                <Text style={styles.headerTitle}>{editMode ? 'Edit Property' : 'List Your Property'}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3].map(step => (
                        <View key={step} style={styles.stepWrapper}>
                            <View style={[
                                styles.stepCircle,
                                currentStep >= step && styles.stepCircleActive
                            ]}>
                                {currentStep > step ? (
                                    <Icon name="checkmark" size={16} color={Colors.textWhite} />
                                ) : (
                                    <Text style={[
                                        styles.stepNumber,
                                        currentStep >= step && styles.stepNumberActive
                                    ]}>{step}</Text>
                                )}
                            </View>
                            {step < 3 && <View style={[
                                styles.stepLine,
                                currentStep > step && styles.stepLineActive
                            ]} />}
                        </View>
                    ))}
                </View>

                {currentStep === 1 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Media & Basics</Text>
                        <Text style={styles.stepDesc}>Upload photos and video of your property</Text>

                        {/* Image Upload */}
                        <Text style={styles.sectionLabel}>Property Images (Max 4) *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                            <TouchableOpacity
                                style={styles.addImageButton}
                                onPress={handlePickImage}
                                disabled={images.length >= 4}
                            >
                                <Icon name="camera-outline" size={28} color={images.length >= 4 ? Colors.textLight : Colors.primary} />
                                <Text style={[styles.addImageText, images.length >= 4 && { color: Colors.textLight }]}>Add Photo</Text>
                            </TouchableOpacity>
                            {images.map((img, index) => (
                                <View key={index} style={styles.imagePreview}>
                                    <Image source={{ uri: img }} style={styles.previewImage} />
                                    <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                                        <Icon name="close" size={16} color={Colors.textWhite} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Video Upload Section */}
                        <Text style={styles.sectionLabel}>Property Video (Optional)</Text>
                        <TouchableOpacity style={styles.videoUploadBox} onPress={handlePickVideo}>
                            {video ? (
                                <View style={styles.videoSelected}>
                                    <Icon name="checkmark-circle" size={32} color={Colors.primary} />
                                    <Text style={styles.videoUploadText}>Video Selected!</Text>
                                    <TouchableOpacity onPress={() => setVideo(null)}>
                                        <Text style={{ color: Colors.error, fontWeight: '700', marginTop: 5 }}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <Icon name="videocam-outline" size={32} color={Colors.primary} />
                                    <Text style={styles.videoUploadText}>Upload Property Video (Max 30MB)</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.sectionLabel}>Selling Type *</Text>
                        <View style={styles.typeContainer}>
                            {['Sell', 'Rent', 'Lease'].map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.typeChip, form.sellingType === type && styles.typeChipActive]}
                                    onPress={() => updateField('sellingType', type)}
                                >
                                    <Text style={[styles.typeChipText, form.sellingType === type && styles.typeChipTextActive]}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <CustomButton title="Next: Property Details" onPress={nextStep} style={styles.nextButton} />
                    </View>
                )}

                {currentStep === 2 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Property Details</Text>
                        <Text style={styles.stepDesc}>Tell us more about your property</Text>

                        <Text style={styles.sectionLabel}>Category *</Text>
                        <View style={styles.typeContainer}>
                            {['Residential', 'Commercial', 'Agricultural', 'Industrial'].map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.typeChip, form.type === cat && styles.typeChipActive]}
                                    onPress={() => updateField('type', cat)}
                                >
                                    <Text style={[styles.typeChipText, form.type === cat && styles.typeChipTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.sectionLabel}>Property Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 3 BHK Luxury Apartment"
                            value={form.title}
                            onChangeText={v => updateField('title', v)}
                        />

                        <Text style={styles.sectionLabel}>Price (₹) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 4500000"
                            keyboardType="numeric"
                            value={form.price}
                            onChangeText={v => updateField('price', v)}
                        />

                        <View style={styles.threeColumn}>
                            <View style={styles.thirdField}>
                                <Text style={styles.sectionLabel}>Beds</Text>
                                <TextInput style={styles.input} placeholder="3" keyboardType="numeric" value={form.bedrooms} onChangeText={v => updateField('bedrooms', v)} />
                            </View>
                            <View style={styles.thirdField}>
                                <Text style={styles.sectionLabel}>Baths</Text>
                                <TextInput style={styles.input} placeholder="2" keyboardType="numeric" value={form.bathrooms} onChangeText={v => updateField('bathrooms', v)} />
                            </View>
                            <View style={styles.thirdField}>
                                <Text style={styles.sectionLabel}>Sq.Ft</Text>
                                <TextInput style={styles.input} placeholder="1500" keyboardType="numeric" value={form.sqft} onChangeText={v => updateField('sqft', v)} />
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Add Features (e.g. Park Facing) *</Text>
                        <View style={styles.featureInputRow}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="Enter feature..."
                                value={newFeature}
                                onChangeText={setNewFeature}
                            />
                            <TouchableOpacity style={styles.addFeatureBtn} onPress={addFeature}>
                                <Icon name="add" size={24} color={Colors.textWhite} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.featureChips}>
                            {form.features.map((f, i) => (
                                <View key={i} style={styles.featureChip}>
                                    <Text style={styles.featureChipText}>{f}</Text>
                                    <TouchableOpacity onPress={() => removeFeature(i)}>
                                        <Icon name="close" size={14} color={Colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                                <Text style={styles.prevButtonText}>Back</Text>
                            </TouchableOpacity>
                            <CustomButton title="Next: Location" onPress={nextStep} style={{ flex: 1 }} />
                        </View>
                    </View>
                )}

                {currentStep === 3 && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Location & Finish</Text>
                        <Text style={styles.stepDesc}>Finalize your property listing</Text>

                        <Text style={styles.sectionLabel}>City/District *</Text>
                        <TextInput style={styles.input} value={form.city} onChangeText={v => updateField('city', v)} />

                        <Text style={styles.sectionLabel}>Area *</Text>
                        <TextInput style={styles.input} placeholder="e.g. Freeganj" value={form.area} onChangeText={v => updateField('area', v)} />

                        <Text style={styles.sectionLabel}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your property..."
                            multiline
                            value={form.description}
                            onChangeText={v => updateField('description', v)}
                        />

                        <View style={styles.paymentNotice}>
                            <Icon name="card-outline" size={24} color={Colors.accent} />
                            <Text style={styles.paymentTitle}>Listing Fee: ₹20</Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                                <Text style={styles.prevButtonText}>Back</Text>
                            </TouchableOpacity>
                            <CustomButton
                                title={editMode ? 'Save Changes' : 'Pay & List'}
                                onPress={handleSubmit}
                                loading={loading}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
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
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    scrollContent: { padding: 20 },
    // Progress Indicator
    progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
    stepWrapper: { flexDirection: 'row', alignItems: 'center' },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stepCircleActive: { backgroundColor: Colors.primary },
    stepNumber: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
    stepNumberActive: { color: Colors.textWhite },
    stepLine: { width: 40, height: 2, backgroundColor: Colors.border, marginHorizontal: 5 },
    stepLineActive: { backgroundColor: Colors.primary },
    // Step Content
    stepContent: { animationDuration: '400ms' },
    stepTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
    stepDesc: { fontSize: 14, color: Colors.textSecondary, marginBottom: 25 },
    sectionLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12, marginTop: 10 },
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
    textArea: { height: 120, paddingTop: 14 },
    typeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    typeChip: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: Colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: Colors.border
    },
    typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    typeChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
    typeChipTextActive: { color: Colors.textWhite, fontWeight: '600' },
    threeColumn: { flexDirection: 'row', gap: 10 },
    thirdField: { flex: 1 },
    imageScroll: { marginBottom: 25 },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(27, 94, 32, 0.05)',
        marginRight: 15,
    },
    addImageText: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginTop: 5 },
    imagePreview: { width: 100, height: 100, borderRadius: 14, marginRight: 15, position: 'relative' },
    previewImage: { width: '100%', height: '100%', borderRadius: 14 },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoUploadBox: {
        height: 120,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        gap: 10,
    },
    videoUploadText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
    videoSelected: { alignItems: 'center' },
    paymentNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 145, 0, 0.08)',
        borderRadius: 14,
        padding: 15,
        marginBottom: 25,
        gap: 12
    },
    paymentTitle: { fontSize: 16, fontWeight: '700', color: Colors.accent },
    buttonRow: { flexDirection: 'row', gap: 15, marginTop: 20 },
    prevButton: {
        flex: 0.4,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center'
    },
    prevButtonText: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
    nextButton: { marginTop: 10 },
    // Feature List
    featureInputRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    addFeatureBtn: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    featureChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    featureChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: Colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    featureChipText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
});

export default AddPropertyScreen;

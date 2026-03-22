import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import Colors from '../../constants/colors';
import { getUsers, deleteUser, updateUser } from '../../api/userApi';
import { getAgents, toggleAgentStatus, deleteAgent, getAgentsByFranchise, updateAgent, updateAgentInFranchise, deleteAgentInFranchise, addAgentToFranchise } from '../../api/agentApi';
import { getFranchises, toggleFranchiseStatus, deleteFranchise, createFranchise, updateFranchise } from '../../api/franchiseApi';
import useAuthStore from '../../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManagementListScreen = ({ navigation, route }) => {
    const { mode } = route.params; // 'users', 'agents', 'franchises'
    const [user, setUser] = React.useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        image: null
    });

    useEffect(() => {
        const loadUser = async () => {
            const stored = await AsyncStorage.getItem('userData');
            if (stored) setUser(JSON.parse(stored));
        };
        loadUser();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (mode === 'users') res = await getUsers();
            else if (mode === 'agents') {
                if (user?.role === 'franchise') {
                    res = await getAgentsByFranchise(user.id || user._id);
                } else {
                    res = await getAgents();
                }
            }
            else res = await getFranchises();

            setData(res.data?.users || res.data?.agents || res.data?.franchises || res.data || []);
        } catch (e) {
            console.error('Fetch Management Error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [mode, user]);

    const handlePickImage = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (res) => {
            if (res.assets && res.assets[0]) {
                setFormData({ ...formData, image: res.assets[0] });
            }
        });
    };

    const handleCreate = async () => {
        if (!formData.name) return Alert.alert('Error', 'Name is required');
        setSubmitting(true);
        try {
            const fd = new FormData();

            if (mode === 'agents') {
                fd.append('name', formData.name);
                if (formData.email) fd.append('email', formData.email.trim().toLowerCase());
                if (formData.phone) fd.append('contact', formData.phone.trim());
                if (formData.password) fd.append('password', formData.password.trim());
            } else {
                // Franchise Schema
                fd.append('fullName', formData.name);
                if (formData.email) fd.append('email', formData.email.trim().toLowerCase());
                if (formData.phone) fd.append('contact', formData.phone.trim());
                if (formData.address) fd.append('city', formData.address.trim());
                if (formData.password) {
                    fd.append('password', formData.password.trim());
                    fd.append('confirmPassword', formData.password.trim());
                }
            }

            if (formData.image) {
                fd.append('image', {
                    uri: formData.image.uri,
                    type: formData.image.type,
                    name: formData.image.fileName
                });
            }

            if (mode === 'agents' && user?.role === 'franchise') {
                await addAgentToFranchise(user.id || user._id, fd);
                Alert.alert('Success', 'Agent added successfully');
            } else {
                await createFranchise(fd);
                Alert.alert('Success', 'Franchise created successfully');
            }
            setShowCreateModal(false);
            setFormData({ name: '', email: '', phone: '', address: '', image: null, password: '' });
            fetchData();
        } catch (e) {
            Alert.alert('Error', e.response?.data?.message || `Failed to create ${mode === 'agents' ? 'agent' : 'franchise'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name || item.fullName || '',
            email: item.email || '',
            phone: item.contact || item.phone || '',
            address: item.city || item.address || '',
            image: null
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!formData.name) return Alert.alert('Error', 'Name is required');
        setSubmitting(true);
        try {
            const id = editingItem.id || editingItem._id;
            let res;
            if (mode === 'users') {
                res = await updateUser(id, { name: formData.name, email: formData.email });
            } else if (mode === 'agents') {
                const fd = new FormData();
                fd.append('name', formData.name);
                if (formData.phone) fd.append('contact', formData.phone.trim());
                if (formData.image) {
                    fd.append('image', {
                        uri: formData.image.uri,
                        type: formData.image.type,
                        name: formData.image.fileName
                    });
                }
                if (user?.role === 'franchise') {
                    res = await updateAgentInFranchise(user.id || user._id, id, fd);
                } else {
                    res = await updateAgent(id, fd);
                }
            } else {
                // Franchise Update JSON schema
                const updates = { fullName: formData.name };
                if (formData.phone) updates.contact = formData.phone.trim();
                if (formData.address) updates.city = formData.address.trim();
                res = await updateFranchise(id, updates);
            }

            Alert.alert('Success', 'Updated successfully');
            setShowEditModal(false);
            setEditingItem(null);
            fetchData();
        } catch (e) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to update item.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (item) => {
        try {
            if (mode === 'agents') await toggleAgentStatus(item.id || item._id);
            else if (mode === 'franchises') await toggleFranchiseStatus(item.id || item._id);
            fetchData();
        } catch (e) {
            Alert.alert('Error', 'Failed to toggle status.');
        }
    };

    const handleDelete = (id) => {
        Alert.alert(`Delete ${mode.slice(0, -1)}`, 'This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        if (mode === 'users') await deleteUser(id);
                        else if (mode === 'agents') {
                            if (user?.role === 'franchise') await deleteAgentInFranchise(user.id || user._id, id);
                            else await deleteAgent(id);
                        }
                        else await deleteFranchise(id);
                        setData(prev => prev.filter(i => (i.id || i._id) !== id));
                    } catch (e) {
                        Alert.alert('Error', 'Failed to delete item.');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.avatar || item.image || 'https://i.pravatar.cc/150' }}
                style={styles.avatar}
            />
            <View style={styles.content}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.email || item.phone || item.address || 'No contact'}</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: item.isActive ? Colors.success + '15' : Colors.error + '15' }]}>
                        <Text style={[styles.statusText, { color: item.isActive ? Colors.success : Colors.error }]}>
                            {item.isActive ? 'Active' : 'Blocked'}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    {mode !== 'users' && (
                        <TouchableOpacity onPress={() => handleToggle(item)} style={styles.toggleBtn}>
                            <Text style={styles.toggleText}>Toggle</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id || item._id)} style={styles.deleteBtn}>
                <Icon name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage {mode.charAt(0).toUpperCase() + mode.slice(1)}</Text>
                {(mode === 'franchises' && user?.role === 'admin') || (mode === 'agents' && user?.role === 'franchise') ? (
                    <TouchableOpacity onPress={() => setShowCreateModal(true)} style={styles.addBtn}>
                        <Icon name="add" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 44 }} />
                )}
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => (item.id || item._id).toString()}
                    contentContainerStyle={styles.list}
                    onRefresh={fetchData}
                    refreshing={loading}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>No records found</Text>
                        </View>
                    }
                />
            )}

            {/* Create Modal (Franchise Only) */}
            <Modal visible={showCreateModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New {mode === 'agents' ? 'Agent' : 'Franchise'}</Text>
                            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                                <Icon name="close" size={24} color={Colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImage}>
                                {formData.image ? (
                                    <Image source={{ uri: formData.image.uri }} style={styles.pickedImage} />
                                ) : (
                                    <Icon name="camera" size={30} color={Colors.textLight} />
                                )}
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                placeholder="Branch Name"
                                value={formData.name}
                                onChangeText={t => setFormData({ ...formData, name: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                value={formData.email}
                                onChangeText={t => setFormData({ ...formData, email: t })}
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChangeText={t => setFormData({ ...formData, phone: t })}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address / Location"
                                value={formData.address}
                                onChangeText={t => setFormData({ ...formData, address: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={formData.password}
                                onChangeText={t => setFormData({ ...formData, password: t })}
                                secureTextEntry
                            />
                            <TouchableOpacity
                                style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                                onPress={handleCreate}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color={Colors.textWhite} />
                                ) : (
                                    <Text style={styles.submitBtnText}>Create {mode === 'agents' ? 'Agent' : 'Franchise'}</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Edit Modal */}
            <Modal visible={showEditModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit {mode.slice(0, -1)}</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Icon name="close" size={24} color={Colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {mode !== 'users' && (
                                <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImage}>
                                    {formData.image ? (
                                        <Image source={{ uri: formData.image.uri }} style={styles.pickedImage} />
                                    ) : (
                                        <Icon name="camera" size={30} color={Colors.textLight} />
                                    )}
                                </TouchableOpacity>
                            )}
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={formData.name}
                                onChangeText={t => setFormData({ ...formData, name: t })}
                            />
                            {mode === 'users' && (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={formData.email}
                                    onChangeText={t => setFormData({ ...formData, email: t })}
                                />
                            )}
                            <TouchableOpacity
                                style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
                                onPress={handleUpdate}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color={Colors.textWhite} />
                                ) : (
                                    <Text style={styles.submitBtnText}>Update {mode.slice(0, -1)}</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    backBtn: { padding: 8 },
    addBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    list: { padding: 16 },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 1
    },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.border },
    content: { flex: 1, marginLeft: 12 },
    name: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    subtitle: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontSize: 10, fontWeight: '700' },
    editBtn: { backgroundColor: Colors.primarySoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    editText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
    toggleBtn: { backgroundColor: Colors.accentSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    toggleText: { fontSize: 10, color: Colors.accent, fontWeight: '700' },
    deleteBtn: { padding: 10 },
    centered: { flex: 1, justifyContent: 'center' },
    empty: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: Colors.textLight },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
    imagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.backgroundSecondary, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
    pickedImage: { width: '100%', height: '100%' },
    input: { backgroundColor: Colors.backgroundSecondary, borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 14, color: Colors.textPrimary },
    submitBtn: { backgroundColor: Colors.primary, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 10 },
    submitBtnText: { color: Colors.textWhite, fontSize: 16, fontWeight: '700' }
});

export default ManagementListScreen;

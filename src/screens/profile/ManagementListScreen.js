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
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { getUsers, deleteUser } from '../../api/userApi';
import { getAgents, toggleAgentStatus, deleteAgent } from '../../api/agentApi';
import { getFranchises, toggleFranchiseStatus, deleteFranchise } from '../../api/franchiseApi';

const ManagementListScreen = ({ navigation, route }) => {
    const { mode } = route.params; // 'users', 'agents', 'franchises'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (mode === 'users') res = await getUsers();
            else if (mode === 'agents') res = await getAgents();
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
    }, [mode]);

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
                        else if (mode === 'agents') await deleteAgent(id);
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
                <Text style={styles.subtitle}>{item.email || item.phone || 'No contact'}</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: item.isActive ? Colors.success + '15' : Colors.error + '15' }]}>
                        <Text style={[styles.statusText, { color: item.isActive ? Colors.success : Colors.error }]}>
                            {item.isActive ? 'Active' : 'Blocked'}
                        </Text>
                    </View>
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
                <View style={{ width: 44 }} />
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
    toggleBtn: { backgroundColor: Colors.primarySoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    toggleText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
    deleteBtn: { padding: 10 },
    centered: { flex: 1, justifyContent: 'center' },
    empty: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: Colors.textLight }
});

export default ManagementListScreen;

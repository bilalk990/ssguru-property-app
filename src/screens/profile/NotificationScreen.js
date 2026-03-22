import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { getNotifications, deleteNotification } from '../../api/notificationApi';

const NotificationScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data?.notifications || res.data || []);
        } catch (e) {
            console.error('Fetch Notifications Error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDelete = (id) => {
        Alert.alert('Delete Notification', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteNotification(id);
                        setNotifications(prev => prev.filter(n => (n.id || n._id) !== id));
                    } catch (e) {
                        Alert.alert('Error', 'Failed to delete notification.');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.notificationCard}>
            <View style={styles.iconContainer}>
                <Icon
                    name={item.type === 'alert' ? 'alert-circle' : 'notifications'}
                    size={24}
                    color={item.type === 'alert' ? Colors.error : Colors.primary}
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.notiTitle}>{item.title}</Text>
                <Text style={styles.notiDesc}>{item.message}</Text>
                <Text style={styles.notiTime}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id || item._id)} style={styles.deleteBtn}>
                <Icon name="trash-outline" size={20} color={Colors.textLight} />
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
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => (item.id || item._id).toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Icon name="notifications-off-outline" size={60} color={Colors.border} />
                            <Text style={styles.emptyText}>No notifications yet</Text>
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
        borderBottomColor: Colors.border
    },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    list: { padding: 16 },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    content: { flex: 1 },
    notiTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    notiDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
    notiTime: { fontSize: 11, color: Colors.textLight, marginTop: 6 },
    deleteBtn: { padding: 8 },
    centered: { flex: 1, justifyContent: 'center' },
    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: Colors.textLight, fontSize: 16, marginTop: 10 }
});

export default NotificationScreen;

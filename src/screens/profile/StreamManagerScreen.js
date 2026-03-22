import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { getCurrentStream, setStream, deleteStream } from '../../api/streamApi';
import CustomButton from '../../components/CustomButton';

const StreamManagerScreen = ({ navigation }) => {
    const [url, setUrl] = useState('');
    const [currentStream, setCurrentStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchStream = async () => {
        setLoading(true);
        try {
            const res = await getCurrentStream();
            setCurrentStream(res.data?.url || null);
            if (res.data?.url) setUrl(res.data.url);
        } catch (error) {
            console.error('Fetch Stream Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStream();
    }, []);

    const handleUpdate = async () => {
        if (!url) {
            Alert.alert('Required', 'Please enter a stream URL (e.g. YouTube Live or Facebook Live).');
            return;
        }
        setUpdating(true);
        try {
            await setStream(url);
            Alert.alert('Success', 'Live Tour stream URL updated!');
            fetchStream();
        } catch (error) {
            Alert.alert('Error', 'Failed to update stream URL.');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Stop Stream', 'This will remove the live tour button for all users.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: async () => {
                    setUpdating(true);
                    try {
                        await deleteStream();
                        setUrl('');
                        setCurrentStream(null);
                        Alert.alert('Success', 'Live Tour removed.');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete stream.');
                    } finally {
                        setUpdating(false);
                    }
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Stream Manager</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.statusSection}>
                        <View style={[styles.statusIndicator, currentStream ? styles.statusLive : styles.statusOffline]} />
                        <Text style={styles.statusText}>
                            Status: <Text style={{ fontWeight: '800' }}>{currentStream ? 'LIVE NOW' : 'OFFLINE'}</Text>
                        </Text>
                    </View>

                    <View style={styles.formCard}>
                        <Text style={styles.label}>Tour Stream URL</Text>
                        <Text style={styles.hint}>Paste your YouTube Live, Facebook Live, or direct stream link below.</Text>

                        <View style={styles.inputWrapper}>
                            <Icon name="videocam-outline" size={20} color={Colors.primary} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="https://youtube.com/live/..."
                                value={url}
                                onChangeText={setUrl}
                                autoCapitalize="none"
                                placeholderTextColor={Colors.textLight}
                            />
                        </View>

                        <CustomButton
                            title={currentStream ? "Update Link" : "Start Live Tour"}
                            onPress={handleUpdate}
                            loading={updating}
                            size="large"
                            style={styles.actionBtn}
                            icon="flash-outline"
                        />

                        {currentStream && (
                            <TouchableOpacity style={styles.deleteLink} onPress={handleDelete}>
                                <Icon name="trash-outline" size={18} color={Colors.error} />
                                <Text style={styles.deleteText}>Remove Current Stream</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.infoBox}>
                        <Icon name="information-circle-outline" size={24} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            When a live stream URL is set, a floating "WATCH LIVE TOUR" button appears on the home screen for all users.
                        </Text>
                    </View>
                </ScrollView>
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
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 16,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    content: { padding: 24 },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 12,
        elevation: 1
    },
    statusIndicator: { width: 12, height: 12, borderRadius: 6 },
    statusLive: { backgroundColor: '#FF0000' },
    statusOffline: { backgroundColor: Colors.textLight },
    statusText: { fontSize: 15, color: Colors.textPrimary },
    formCard: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        padding: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    label: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, textTransform: 'uppercase', marginBottom: 8 },
    hint: { fontSize: 12, color: Colors.textSecondary, marginBottom: 20, lineHeight: 18 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 16,
        height: 60,
        paddingHorizontal: 16,
        marginBottom: 24
    },
    icon: { marginRight: 12 },
    input: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
    actionBtn: { marginBottom: 20 },
    deleteLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    deleteText: { color: Colors.error, fontWeight: '700', fontSize: 14 },
    infoBox: {
        flexDirection: 'row',
        marginTop: 32,
        backgroundColor: Colors.primarySoft,
        padding: 16,
        borderRadius: 16,
        gap: 12,
        alignItems: 'flex-start'
    },
    infoText: { flex: 1, fontSize: 13, color: Colors.primary, lineHeight: 20, fontWeight: '500' },
    centered: { flex: 1, justifyContent: 'center' }
});

export default StreamManagerScreen;

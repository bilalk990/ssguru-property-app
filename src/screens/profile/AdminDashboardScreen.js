import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { getAdminStats } from '../../api/dashboardApi';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
        <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
            <Icon name={icon} size={24} color={color} />
        </View>
        <View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    </View>
);

const AdminDashboardScreen = ({ navigation }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAdminStats();
                // Backend returns { success, stats: { users, franchise, properties, ... } }
                const raw = res.data?.stats || res.data?.data || res.data || {};
                setStats({
                    totalProperties: raw.properties || raw.totalProperties || 0,
                    totalAgents: raw.users || raw.totalAgents || 0,
                    totalEnquiries: raw.totalEnquiries || 0,
                    totalUsers: raw.users || raw.totalUsers || 0,
                });
            } catch (error) {
                console.error('Fetch Stats Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Platform Insights</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <View style={styles.statsGrid}>
                        <StatCard
                            title="Total Properties"
                            value={stats?.totalProperties || 0}
                            icon="business"
                            color={Colors.primary}
                        />
                        <StatCard
                            title="Total Agents"
                            value={stats?.totalAgents || 0}
                            icon="people"
                            color={Colors.accent}
                        />
                        <StatCard
                            title="New Enquiries"
                            value={stats?.totalEnquiries || 0}
                            icon="chatbubbles"
                            color="#673AB7"
                        />
                        <StatCard
                            title="Active Users"
                            value={stats?.totalUsers || 0}
                            icon="person"
                            color="#FF9800"
                        />
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.infoHeading}>Management Tools</Text>
                        <TouchableOpacity
                            style={styles.toolItem}
                            onPress={() => navigation.navigate('ManagementList', { mode: 'users' })}
                        >
                            <Icon name="people-outline" size={22} color={Colors.textPrimary} />
                            <Text style={styles.toolText}>Manage Users</Text>
                            <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toolItem}
                            onPress={() => navigation.navigate('ManagementList', { mode: 'agents' })}
                        >
                            <Icon name="shield-checkmark-outline" size={22} color={Colors.textPrimary} />
                            <Text style={styles.toolText}>Manage Agents</Text>
                            <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toolItem}
                            onPress={() => navigation.navigate('ManagementList', { mode: 'franchises' })}
                        >
                            <Icon name="business-outline" size={22} color={Colors.textPrimary} />
                            <Text style={styles.toolText}>Manage Franchises</Text>
                            <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toolItem}
                            onPress={() => navigation.navigate('LocationManager')}
                        >
                            <Icon name="location-outline" size={22} color={Colors.textPrimary} />
                            <Text style={styles.toolText}>Manage Locations</Text>
                            <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toolItem}
                            onPress={() => navigation.navigate('StreamManager')}
                        >
                            <Icon name="videocam-outline" size={22} color={Colors.textPrimary} />
                            <Text style={styles.toolText}>Manage Live Tour</Text>
                            <Icon name="chevron-forward" size={18} color={Colors.textLight} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    scrollContent: { padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    statCard: {
        width: (width - 55) / 2,
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 20,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    statValue: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
    statTitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
    infoSection: { marginTop: 30 },
    infoHeading: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 15 },
    toolItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 15,
        marginBottom: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.border
    },
    toolText: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary }
});

export default AdminDashboardScreen;

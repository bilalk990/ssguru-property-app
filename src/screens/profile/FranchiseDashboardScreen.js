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
import { getFranchiseStats } from '../../api/dashboardApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const StatItem = ({ label, value, color, icon }) => (
    <View style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
            <Icon name={icon} size={20} color={color} />
        </View>
        <View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
);

const FranchiseDashboardScreen = ({ navigation }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [franchiseId, setFranchiseId] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                const user = JSON.parse(userData);
                const fid = user?.franchiseId || user?.franchise || 'default';
                setFranchiseId(fid);

                const res = await getFranchiseStats(fid);
                setStats(res.data);
            } catch (error) {
                console.error('Fetch Franchise Stats Error:', error);
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Franchise Dashboard</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.welcomeCard}>
                        <Text style={styles.welcomeTitle}>Branch Insights</Text>
                        <Text style={styles.welcomeSub}>Performance overview for your franchise territory.</Text>
                    </View>

                    <View style={styles.statsGrid}>
                        <StatItem
                            label="Our Properties"
                            value={stats?.totalProperties || 0}
                            color={Colors.primary}
                            icon="business"
                        />
                        <StatItem
                            label="Branch Agents"
                            value={stats?.totalAgents || 0}
                            color={Colors.accent}
                            icon="people"
                        />
                        <StatItem
                            label="Active Enquiries"
                            value={stats?.totalEnquiries || 0}
                            color="#673AB7"
                            icon="chatbubbles"
                        />
                        <StatItem
                            label="Sales Value"
                            value={`Rs ${stats?.totalSalesValue || '0M'}`}
                            color="#2E7D32"
                            icon="trending-up"
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.tools}>
                        <TouchableOpacity
                            style={styles.toolBtn}
                            onPress={() => navigation.navigate('ManagementList', { mode: 'agents' })}
                        >
                            <View style={styles.toolIconBox}>
                                <Icon name="people-outline" size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.toolLabel}>Manage{'\n'}Agents</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.toolBtn}
                            onPress={() => navigation.navigate('Leads')}
                        >
                            <View style={[styles.toolIconBox, { backgroundColor: '#FFF3E0' }]}>
                                <Icon name="flash-outline" size={24} color="#E65100" />
                            </View>
                            <Text style={styles.toolLabel}>View{'\n'}Leads</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.toolBtn}
                            onPress={() => navigation.navigate('AddProperty')}
                        >
                            <View style={[styles.toolIconBox, { backgroundColor: '#E8F5E9' }]}>
                                <Icon name="add-circle-outline" size={24} color="#2E7D32" />
                            </View>
                            <Text style={styles.toolLabel}>New{'\n'}Listing</Text>
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
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    content: { padding: 20 },
    welcomeCard: { marginBottom: 30 },
    welcomeTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
    welcomeSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        backgroundColor: Colors.backgroundSecondary,
        padding: 20,
        borderRadius: 24
    },
    statItem: {
        width: (width - 85) / 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10
    },
    statIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    statLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
    statValue: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginTop: 40, marginBottom: 20 },
    tools: { flexDirection: 'row', gap: 15 },
    toolBtn: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border
    },
    toolIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primarySoft, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    toolLabel: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default FranchiseDashboardScreen;

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { getCurrentStream } from '../../api/streamApi';

const { width, height } = Dimensions.get('window');

const LiveTourScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [streamUrl, setStreamUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        fetchStream();
    }, []);

    const fetchStream = async () => {
        try {
            console.log('[LiveTourScreen] Fetching stream...');
            const res = await getCurrentStream();
            console.log('[LiveTourScreen] Full response:', res);
            console.log('[LiveTourScreen] Response data:', JSON.stringify(res.data, null, 2));
            
            const streamData = res.data?.data || res.data?.stream || res.data;
            console.log('[LiveTourScreen] Stream data:', streamData);
            console.log('[LiveTourScreen] youtubeUrl:', streamData?.youtubeUrl);
            console.log('[LiveTourScreen] isActive:', streamData?.isActive);
            console.log('[LiveTourScreen] active:', streamData?.active);
            
            const isStreamActive = streamData?.isActive === true || streamData?.active === true;
            
            if (streamData?.youtubeUrl && isStreamActive) {
                console.log('[LiveTourScreen] ✅ Stream is ACTIVE');
                setStreamUrl(streamData.youtubeUrl);
                setIsActive(true);
            } else {
                console.log('[LiveTourScreen] ❌ Stream is INACTIVE');
                setIsActive(false);
            }
        } catch (error) {
            console.error('[LiveTourScreen] Fetch Stream Error:', error);
            console.log('[LiveTourScreen] Error response:', error.response?.data);
            setIsActive(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />

            {/* Header */}
            <View style={[styles.header, { top: Math.max(insets.top, 20) }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="close" size={28} color="#FFF" />
                </TouchableOpacity>
                {isActive && (
                    <View style={styles.liveBadge}>
                        <View style={styles.dot} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                )}
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>{t('home.connectingToTour')}</Text>
                </View>
            ) : isActive && streamUrl ? (
                <WebView
                    source={{ uri: streamUrl }}
                    style={styles.webview}
                    allowsFullscreenVideo
                    javaScriptEnabled
                    domStorageEnabled
                />
            ) : (
                <View style={styles.centerContainer}>
                    <Icon name="videocam-off-outline" size={80} color={Colors.textLight} />
                    <Text style={styles.noLiveTitle}>{t('home.noLiveTour')}</Text>
                    <Text style={styles.noLiveText}>
                        No live tour is available right now. Please check back later.
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    webview: { flex: 1, backgroundColor: '#000' },
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
        alignItems: 'center'
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF0000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFF'
    },
    liveText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.5
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40
    },
    loadingText: {
        color: '#FFF',
        marginTop: 15,
        fontSize: 14,
        opacity: 0.8
    },
    noLiveTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center'
    },
    noLiveText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22
    }
});

export default LiveTourScreen;

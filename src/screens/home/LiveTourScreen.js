import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview'; // Common for social streams
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/colors';
import { getCurrentStream } from '../../api/streamApi';

const { width, height } = Dimensions.get('window');

const LiveTourScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [streamUrl, setStreamUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const res = await getCurrentStream();
                if (res.data?.data?.youtubeUrl || res.data?.youtubeUrl) {
                    setStreamUrl(res.data?.data?.youtubeUrl || res.data?.youtubeUrl);
                } else {
                    Alert.alert(t('common.notice'), t('home.noLiveTour'), [
                        { text: t('common.back'), onPress: () => navigation.goBack() }
                    ]);
                }
            } catch (error) {
                console.error('Fetch Stream Error:', error);
                Alert.alert(t('common.error'), t('home.liveTourError'));
            } finally {
                setLoading(false);
            }
        };
        fetchStream();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />

            {/* Overlay Header */}
            <View style={[styles.overlayHeader, { top: Math.max(insets.top, 20) }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="close" size={28} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.liveBadge}>
                    <View style={styles.dot} />
                    <Text style={styles.liveText}>{t('home.liveTourBadge')}</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>{t('home.connectingToTour')}</Text>
                </View>
            ) : streamUrl ? (
                <WebView
                    source={{ uri: streamUrl }}
                    style={styles.webview}
                    allowsFullscreenVideo
                    javaScriptEnabled
                    domStorageEnabled
                />
            ) : null}

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
                <Text style={styles.title}>{t('common.appName')} Live</Text>
                <Text style={styles.subtitle}>{t('home.liveTourDesc')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    webview: { flex: 1, backgroundColor: '#000' },
    overlayHeader: {
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: '#FFF',
        marginTop: 15,
        fontSize: 14,
        opacity: 0.8
    },
    bottomInfo: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800'
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        marginTop: 4
    }
});

export default LiveTourScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const NOTIFICATION_TOKEN_KEY = 'fcm_token';

class NotificationService {
    constructor() {
        this.token = null;
        this.initialized = false;
    }

    /**
     * Initialize notification service
     * Call this in App.tsx on app start
     */
    async initialize() {
        if (this.initialized) return;

        console.log('[NotificationService] Initializing...');

        try {
            // Request permissions
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.log('[NotificationService] Permission denied');
                return;
            }

            // Get FCM token
            await this.getFCMToken();

            // Setup notification handlers
            this.setupNotificationHandlers();

            this.initialized = true;
            console.log('[NotificationService] Initialized successfully');
        } catch (error) {
            console.error('[NotificationService] Initialization error:', error);
        }
    }

    /**
     * Request notification permissions
     */
    async requestPermission() {
        try {
            if (Platform.OS === 'android') {
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
                return true;
            } else {
                // iOS
                const authStatus = await messaging().requestPermission();
                return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            }
        } catch (error) {
            console.error('[NotificationService] Permission error:', error);
            return false;
        }
    }

    /**
     * Get FCM token and save to backend
     */
    async getFCMToken() {
        try {
            const token = await messaging().getToken();
            console.log('[NotificationService] FCM Token:', token);

            this.token = token;
            await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);

            // Send token to backend
            await this.sendTokenToBackend(token);

            return token;
        } catch (error) {
            console.error('[NotificationService] Get token error:', error);
            return null;
        }
    }

    /**
     * Send FCM token to backend
     */
    async sendTokenToBackend(token) {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (!userDataStr) {
                console.log('[NotificationService] No user logged in, skipping token upload');
                return;
            }

            // Import API function
            const { saveFCMToken } = require('../api/userApi');

            await saveFCMToken(token);
            console.log('[NotificationService] Token sent to backend successfully');
        } catch (error) {
            console.error('[NotificationService] Send token error:', error);
        }
    }

    /**
     * Setup notification handlers
     */
    setupNotificationHandlers() {
        // Handle notifications when app is in foreground
        messaging().onMessage(async remoteMessage => {
            console.log('[NotificationService] Foreground notification:', remoteMessage);
            this.showLocalNotification(remoteMessage);
        });

        // Handle notification when app is opened from background
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('[NotificationService] Notification opened app:', remoteMessage);
            this.handleNotificationNavigation(remoteMessage);
        });

        // Handle notification when app is opened from quit state
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('[NotificationService] Notification opened app from quit state:', remoteMessage);
                    this.handleNotificationNavigation(remoteMessage);
                }
            });
    }

    /**
     * Show local notification (for foreground notifications)
     */
    showLocalNotification(remoteMessage) {
        const { notification } = remoteMessage;
        if (notification) {
            Alert.alert(
                notification.title || 'New Notification',
                notification.body || '',
                [{ text: 'OK' }]
            );
        }
    }

    /**
     * Handle notification navigation
     */
    handleNotificationNavigation(remoteMessage) {
        const { data } = remoteMessage;
        console.log('[NotificationService] Navigation data:', data);
        // Navigation logic can be added here if needed
    }

    /**
     * Get stored FCM token
     */
    async getStoredToken() {
        try {
            const token = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);
            return token;
        } catch (error) {
            console.error('[NotificationService] Get stored token error:', error);
            return null;
        }
    }

    /**
     * Clear FCM token (on logout)
     */
    async clearToken() {
        try {
            await messaging().deleteToken();
            await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
            this.token = null;
            console.log('[NotificationService] Token cleared');
        } catch (error) {
            console.error('[NotificationService] Clear token error:', error);
        }
    }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;

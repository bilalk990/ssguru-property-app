import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import notificationService from './src/services/notificationService';
import { getCurrentStream } from './src/api/streamApi';
import './src/i18n/i18n'; // Initialize i18n

// Screens
import SplashScreen from './src/screens/splash/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import OTPScreen from './src/screens/auth/OTPScreen';
import AppNavigator from './src/navigation/AppNavigator';

const RootStack = createNativeStackNavigator();

const App = () => {
  const [showLivePopup, setShowLivePopup] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const navigationRef = React.useRef<any>(null);

  useEffect(() => {
    // Initialize push notifications (wrapped in try-catch to prevent crashes)
    try {
      notificationService.initialize();
    } catch (error) {
      console.log('[App] Notification service init failed:', error);
    }

    // Check for live stream on app open
    checkLiveStream();
  }, []);

  const checkLiveStream = async () => {
    try {
      const res = await getCurrentStream();
      const streamData = res.data?.data || res.data;
      
      if (streamData?.youtubeUrl && streamData?.isActive) {
        setLiveUrl(streamData.youtubeUrl);
        // Show popup after 2 seconds delay
        setTimeout(() => {
          setShowLivePopup(true);
        }, 2000);
      }
    } catch (error) {
      console.log('[App] Live stream check failed:', error);
    }
  };

  const handleWatchLive = () => {
    setShowLivePopup(false);
    // Navigate to LiveTour screen
    setTimeout(() => {
      navigationRef.current?.navigate('MainApp', {
        screen: 'Home',
        params: { screen: 'LiveTour' }
      });
    }, 300);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Signup" component={SignupScreen} />
          <RootStack.Screen name="OTP" component={OTPScreen} />
          <RootStack.Screen name="MainApp" component={AppNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Live Tour Popup */}
      <Modal
        visible={showLivePopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLivePopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE NOW</Text>
            </View>
            
            <Icon name="videocam" size={60} color="#FF0000" style={{ marginVertical: 20 }} />
            
            <Text style={styles.modalTitle}>Property Tour is Live!</Text>
            <Text style={styles.modalDesc}>
              Watch our live property tour happening right now
            </Text>

            <TouchableOpacity style={styles.watchButton} onPress={handleWatchLive}>
              <Text style={styles.watchButtonText}>Watch Live</Text>
              <Icon name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowLivePopup(false)}
            >
              <Text style={styles.cancelButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

export default App;


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  liveText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  watchButton: {
    backgroundColor: '#FF0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    gap: 10,
    elevation: 4,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  watchButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
});

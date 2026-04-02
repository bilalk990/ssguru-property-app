import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import notificationService from './src/services/notificationService';
import './src/i18n/i18n'; // Initialize i18n

// Screens
import SplashScreen from './src/screens/splash/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import OTPScreen from './src/screens/auth/OTPScreen';
import AppNavigator from './src/navigation/AppNavigator';

const RootStack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    // Initialize push notifications (wrapped in try-catch to prevent crashes)
    try {
      notificationService.initialize();
    } catch (error) {
      console.log('[App] Notification service init failed:', error);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Signup" component={SignupScreen} />
          <RootStack.Screen name="OTP" component={OTPScreen} />
          <RootStack.Screen name="MainApp" component={AppNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

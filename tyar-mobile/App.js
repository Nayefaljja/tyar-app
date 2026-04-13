import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';

import { AppProvider, useApp } from './src/constants/AppContext';
import AppNavigator    from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';

function Root() {
  const { isDark } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('tyar-onboarded').then(val => {
      setShowOnboarding(val !== 'yes');
    });
  }, []);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('tyar-onboarded', 'yes');
    setShowOnboarding(false);
  };

  if (showOnboarding === null) return null; // loading

  if (showOnboarding) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardingScreen onDone={finishOnboarding} />
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}

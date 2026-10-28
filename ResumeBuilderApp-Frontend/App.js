import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ResumeProvider, useResume } from './src/context/ResumeContext';

import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TemplateMarketplaceScreen from './src/screens/TemplateMarketplaceScreen';
import ResumeBuilderFlow from './src/screens/steps/ResumeBuilderFlow';
import PreviewScreen from './src/screens/PreviewScreen';
import ExportScreen from './src/screens/ExportScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const MainNavigator = () => {
  const { colors, isDark } = useTheme();
  const { isAuthenticated, loginAsDemo } = useAuth();
  const { startNewResume } = useResume();
  const insets = useSafeAreaInsets();
  // Safe top padding on mobile phones: avoids camera punch-hole, notch, and status bar (time/battery)
  const topInset = Platform.OS === 'web'
    ? 0
    : Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 24);

  // Routes: 'SPLASH' | 'AUTH' | 'DASHBOARD' | 'MARKETPLACE' | 'BUILDER' | 'PREVIEW' | 'EXPORT' | 'PROFILE'
  const [currentRoute, setCurrentRoute] = useState('SPLASH');

  const handleSplashGetStarted = () => {
    // When someone wants to log in or create an account
    setCurrentRoute('AUTH');
  };

  const handleSplashDemo = () => {
    // Everyone can access the full Shrawan Kr Yadav PLUS membership demo
    loginAsDemo();
    setCurrentRoute('DASHBOARD');
  };

  const handleSelectTemplate = (templateId) => {
    startNewResume(templateId);
    setCurrentRoute('BUILDER');
  };

  return (
    <View style={[styles.appContainer, { backgroundColor: colors.background, paddingTop: topInset }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      {currentRoute === 'SPLASH' && (
        <SplashScreen
          onGetStarted={handleSplashGetStarted}
          onDemoMode={handleSplashDemo}
          onGoToAuth={() => setCurrentRoute('AUTH')}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {currentRoute === 'AUTH' && (
        <AuthScreen
          onSuccess={() => setCurrentRoute('DASHBOARD')}
          onBackToSplash={() => setCurrentRoute('SPLASH')}
        />
      )}

      {currentRoute === 'DASHBOARD' && (
        <DashboardScreen
          onStartNewResume={() => setCurrentRoute('MARKETPLACE')}
          onEditResume={() => setCurrentRoute('BUILDER')}
          onViewPreview={() => setCurrentRoute('PREVIEW')}
          onGoToProfile={() => setCurrentRoute('PROFILE')}
          onBack={() => setCurrentRoute('SPLASH')}
        />
      )}

      {currentRoute === 'MARKETPLACE' && (
        <TemplateMarketplaceScreen
          onSelectTemplate={(tmpl) => setCurrentRoute('BUILDER')}
          onBack={() => setCurrentRoute('DASHBOARD')}
        />
      )}

      {currentRoute === 'BUILDER' && (
        <ResumeBuilderFlow
          onExitToDashboard={() => setCurrentRoute('DASHBOARD')}
          onGoToPreview={() => setCurrentRoute('PREVIEW')}
          onGoToExport={() => setCurrentRoute('EXPORT')}
        />
      )}

      {currentRoute === 'PREVIEW' && (
        <PreviewScreen
          onBack={() => setCurrentRoute('BUILDER')}
          onGoToExport={() => setCurrentRoute('EXPORT')}
        />
      )}

      {currentRoute === 'EXPORT' && (
        <ExportScreen
          onBack={() => setCurrentRoute('BUILDER')}
          onGoHome={() => setCurrentRoute('DASHBOARD')}
        />
      )}

      {currentRoute === 'PROFILE' && (
        <ProfileScreen
          onBack={() => setCurrentRoute('DASHBOARD')}
          onLogout={() => setCurrentRoute('SPLASH')}
        />
      )}
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ResumeProvider>
            <View style={styles.safeArea}>
              <MainNavigator />
            </View>
          </ResumeProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  appContainer: {
    flex: 1,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        maxWidth: 480,
        width: '100%',
        marginHorizontal: 'auto',
        minHeight: '100vh',
        backgroundColor: '#090D16',
        boxShadow: '0 0 35px rgba(0,0,0,0.5)',
        overflowX: 'hidden',
      },
    }),
  },
});

import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

// Ensure consistent dark theme and phone responsiveness without white borders on web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root {
      background-color: #090D16 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-height: 100% !important;
      overflow-x: hidden !important;
      -webkit-font-smoothing: antialiased;
    }
  `;
  document.head.appendChild(style);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);

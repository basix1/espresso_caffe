
import 'react-native-reanimated';

import { AppRegistry } from 'react-native';
import App from './App'; // deve puntare al tuo App.tsx
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

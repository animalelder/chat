import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
// Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import the two app screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create the app navigator
const Stack = createNativeStackNavigator();

// Ignore a warning about the use of defaultProps in GiftedChat
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

// Ignore a warning about AsyncStorage in GiftedChat
const warning = console.warn;
console.warn = (...args) => {
  if (/asyncStorage/.test(args[0])) return;
  error(...args);
};

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // enter your own Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyC8eNsBTqAHlOMTEAbjwDe10hZ6ldT4eL0',
    authDomain: 'chat-2c9b9.firebaseapp.com',
    projectId: 'chat-2c9b9',
    storageBucket: 'chat-2c9b9.appspot.com',
    messagingSenderId: '679016625869',
    appId: '1:679016625869:web:69b762950b0a0f0f049b84',
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {(props) => <Chat db={db} storage={storage} isConnected={connectionStatus.isConnected} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

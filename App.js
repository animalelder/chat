import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert } from 'react-native';
import { useEffect } from 'react';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firebase
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { useNetInfo } from '@react-native-community/netinfo';

// Create the navigator
const Stack = createNativeStackNavigator();

const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
const warning = console.warn;
console.warn = (...args) => {
  if (/asyncStorage/.test(args[0])) return;
  error(...args);
};

const App = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyC8eNsBTqAHlOMTEAbjwDe10hZ6ldT4eL0',
    authDomain: 'chat-2c9b9.firebaseapp.com',
    projectId: 'chat-2c9b9',
    storageBucket: 'chat-2c9b9.appspot.com',
    messagingSenderId: '679016625869',
    appId: '1:679016625869:web:69b762950b0a0f0f049b84',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {(props) => (
            <Chat
              db={db}
              storage={storage}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff55',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

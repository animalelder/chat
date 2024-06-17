import { useState, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  ActivityIndicator,
} from 'react-native-gifted-chat';
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Text,
} from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, storage, isConnected }) => {
  const { userID } = route.params;
  const { name, background } = route.params;
  const [messages, setMessages] = useState([]);
  let unsubMessages;

  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'cornflowerblue',
            paddingLeft: 5,
          },
          left: {
            backgroundColor: '#f5fffa',
            paddingLeft: 10,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    if (Boolean(isConnected)) return <InputToolbar {...props} />;
    else return null;
  };

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (Boolean(isConnected)) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.error(error);
    }
  };

  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        accessible={true}
        accessibilityLabel='send'
        accessibilityHint='Sends a message'
        accessibilityRole='button'
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        showUserAvatar
        renderAvatarOnTop
        renderUsernameOnMessage
        timeTextStyle={{
          left: { color: 'seagreen' },
          right: { color: 'gold' },
        }}
        alwaysShowSend
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  username: {
    color: 'midnightblue',
    fontSize: 12,
  },
});

export default Chat;

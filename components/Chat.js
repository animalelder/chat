import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { StyleSheet, Platform, KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, storage, isConnected }) => {
  const { userID } = route.params;
  const { name, background } = route.params;
  const [messages, setMessages] = useState([]);
  let unsubMessages;
  let soundObject = null;

  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // Set custom colors/padding for the chat bubbles
  const renderBubble = (props) => {
    let username = props.currentMessage.user.name;
    let color = getColor(username);

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'hsl(201.84,100%,57.45%)',
            paddingLeft: 5,
          },
          left: {
            backgroundColor: color,
            paddingLeft: 5,
          },
        }}
      />
    );
  };

  // Assign a color to each user based on their username
  const getColor = (username) => {
    let sumChars = 0;
    for (let i = 0; i < username.length; i++) {
      sumChars += username.charCodeAt(i);
    }

    const colors = [
      'hsl(336,100%,82.35%)',
      'hsl(11,53.57%,78.04%)',
      '#ffffff',
      'hsl(187.69,100%,92.35%)',
      'hsl(201.84,100%,57.45%)',
      'hsl(173.48,85.19%,89.41%)',
      'hsl(4.19,82.69%,59.22%)',
    ];
    return colors[sumChars % colors.length];
  };

  const renderInputToolbar = (props) => {
    if (Boolean(isConnected)) return <InputToolbar {...props} />;
    else return null;
  };

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (Boolean(isConnected)) {
      // unsubscribe from any pre-existing listeners
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // Set the query to sort messages by creation time and limit to 25
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(25));

      // Listen to the query and add new messages to the state
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
      // if offline, load cached messages
    } else loadCachedMessages();

    // cleanup for messages and audio when the component unmounts
    return () => {
      if (unsubMessages) unsubMessages();
      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.error(error);
    }
  };

  const renderAudioBubble = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{
            backgroundColor: 'hsla(234.23,100%,10.2%, 0.5)',
            borderRadius: 8,
            borderColor: 'hsla(234.23,100%,10.2%, 0.5)',
            borderWidth: 1,
            margin: 5,
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
          onPress={async () => {
            if (soundObject) soundObject.unloadAsync();
            const { sound } = await Audio.Sound.createAsync({ uri: props.currentMessage.audio });
            soundObject = sound;
            await sound.playAsync();
          }}
        >
          <Text style={{ textAlign: 'center', color: 'white', padding: 5 }}>Click to Play 🔊</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Custom actions for chat input from CustomActions.js
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  // Custom view for location messages
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
    // If message is not a location, don't render a custom view
    return null;
  };

  return (
    // SafeAreaView to avoid the iPhone notch and make sure to show the bottom input bar
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        isAnimated
        accessible={true}
        accessibilityLabel='send'
        accessibilityHint='Sends a message'
        accessibilityRole='button'
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderAudioBubble}
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
      {/* KeyboardAvoidingView to make sure the keyboard doesn't cover the input bar on Android */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={80} /> : null}
    </View>
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

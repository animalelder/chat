import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, Alert } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
  const colors = ['#090c08', '#474056', '#8a95a5', '#b9c6ae'];
  const auth = getAuth();

  const signIn = async () => {
    try {
      const result = await signInAnonymously(auth);
      navigation.navigate('Chat', {
        userID: result.user.uid,
        name,
        background,
      });
      Alert.alert('Signed in Successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Unable to sign in, try later again.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../img/BackgroundImage.png')} style={styles.bgImage} resizeMode='cover'>
        <Text style={styles.appTitle}>Let's Chat!</Text>
        <View style={styles.box}>
          <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder='Your Name' />

          <Text style={styles.selectColorText}>Select a background color</Text>
          <View style={styles.colorOptionsBox}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  background === color && styles.selectedColorButton,
                ]}
                onPress={() => setBackground(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              if (name == '') {
                Alert.alert('You need a username');
              } else {
                signIn();
              }
            }}
          >
            <Text style={styles.buttonText}>Enter the Chat</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    marginHorizonal: 'auto',
    fontSize: 45,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#ffffff',
    textShadowColor: '#0e0000a0',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 6,
  },
  box: {
    maxHeight: 400,
    flex: 1,
    backgroundColor: '#FFE7E6af',
    gap: 10,
    flexShrink: 1,
    flexBasis: 'auto',
    minHeight: 300,
    width: '94%',
    height: '54%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    borderColor: '#757083af',
    borderWidth: 4,
    shadowColor: '#000000a0',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 3, height: 2 },
    borderRadius: 15,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textInput: {
    fontSize: 16,
    marginTop: 2,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    textAlign: 'center',
    fontWeight: '600',
    color: '#757083',
    backgroundColor: '#ffffeef0',
    width: '92%',
    height: 50,

    borderWidth: 1,
    borderColor: '#757083fa',
    borderWidth: 4,
    shadowColor: '#f65b7455',
    shadowRadius: 6,
    shadowOffset: { width: 3, height: 2 },
    borderRadius: 5,
  },
  selectColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorOptionsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: 25,
    padding: 10,
    gap: 15,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#fff',
    borderWidth: 2.5,
    margin: 1,
    shadowColor: '#210003',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
  },
  selectedColorButton: {
    borderColor: '#757083',
    borderWidth: 3,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.6,
    shadowColor: '#150001',
  },
  chatButton: {
    textAlign: 'center',
    backgroundColor: '#757083',
    width: 200,
    padding: 10,
    borderWidth: 2.5,
    shadowColor: 'hsla(0, 0%, 0%, .5)',
    shadowRadius: 2,
    shadowOffset: { width: 2, height: 3 },
    borderRadius: 5,
    borderTopWidth: 3,
    borderColor: 'hsla(0, 0%, 100%, 0.5)',
  },
  buttonText: {
    marginHorizontal: 'auto',
    fontSize: 16,
    width: 115,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default Start;

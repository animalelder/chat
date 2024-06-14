import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
} from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
  const colors = ['#090c08', '#474056', '#8a95a5', '#b9c6ae'];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../img/BackgroundImage.png')}
        style={styles.bgImage}
        resizeMode='cover'
      >
        <Text style={styles.appTitle}>Let's Chat!</Text>
        <View style={styles.box}>
          {/* Let user choose a name \*/}

          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Your Name'
            maxLength='15'
          />
          {/* Select background color of chat \*/}
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
          {/* Button to start chat. If no color or username are set, default values are provided \*/}
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate('Chat', {
                name: name || `User${Math.floor(Math.random() * 9999)}`,
                background: background || colors[1],
              })
            }
          >
            <Text style={styles.buttonText}>Enter Chat</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignContent: 'space-around',
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    alignSelf: 'auto',
    letterSpacing: 1.5,
    color: '#ffffff',
    textShadowColor: '#0e0000a0',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 6,
    margin: 20,
  },
  box: {
    backgroundColor: '#FFE7E6af',
    padding: 30,
    width: '88%',
    height: '44%',
    alignContent: 'space-around',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#757083af',
    borderWidth: 4,
    shadowColor: '#000000a0',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 3, height: 2 },
    borderRadius: 6,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757083',
    backgroundColor: '#ffffeef0',
    width: '88%',
    placeholderTextColor: '#757083',
    padding: 10,
    paddingVertical: 15,
    borderWidth: 1,
    marginBottom: 15,
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
    justifyContent: 'space-between',
    margin: 20,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#fff',
    borderWidth: 2.5,
    margin: 5,
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
    alignItems: 'center',
    backgroundColor: '#757083',
    wdith: '88%',
    padding: 10,
    borderWidth: 2.5,
    borderColor: '#ffffffa0',
    shadowColor: '#000000a0',
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 2 },
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default Start;

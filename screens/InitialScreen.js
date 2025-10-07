import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, StatusBar, BackHandler } from 'react-native';
import * as Font from 'expo-font';

const GTH_LOGO = require('../assets/logo.png'); 
const BACKGROUND_IMAGE = require('../assets/principal.jpg'); 

export default function InitialScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
        'PTSerif-Regular': require('../assets/fonts/PTSerif-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background}>
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay} /> 
 
      <View style={styles.contentContainer}>

        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        
        <View style={styles.logoAndTitle}>

          <Image source={GTH_LOGO} style={styles.logo} />

          <Text style={styles.title}>
             <Text style={styles.gthText}>GTH</Text> <Text style={styles.appText}>App</Text>!
          </Text>
        </View>

        <View style={styles.spacer} /> 
        
      </View>

      <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.signUpButton} 
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 20,
    zIndex: 1, 
  },
  spacer: {
      flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    color: '#E0E0E0',
    marginBottom: 25,
    letterSpacing: 1.5,
  },
  logoAndTitle: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '300', 
    color: '#FFFFFF',
    marginTop: 25,
    marginBottom: 20,
  },
  gthText: {
    fontFamily: 'PTSerif-Regular',
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  appText: {
    fontFamily: 'Pacifico',
    fontSize: 45,
    color: '#b9770e',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 0,
    borderRadius: 80,
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 80,
    zIndex: 1,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#000000', 
    paddingVertical: 18, 
    borderRadius: 25,
    width: '100%', 
    alignItems: 'center',
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signInButton: {
    backgroundColor: '#333333', 
    paddingVertical: 18, 
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18, 
    fontWeight: 'bold',
  },
});
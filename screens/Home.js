import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

const HOME_BACKGROUND_IMAGE = require('../assets/home.jpg');
const GTH_LOGO = require('../assets/logo.png');

export default function Home({ navigation }) {

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  return (
    <ImageBackground source={HOME_BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />
      
      <View style={styles.container}>
        <Image source={GTH_LOGO} style={styles.logo} />
        <Text style={styles.title}>Bienvenido a GTH Negocios Inmobiliarios</Text>
        <Text style={styles.subtitle}>¡Tu hogar ideal te espera!</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogOut}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
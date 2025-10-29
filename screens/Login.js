import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar,
  ImageBackground,
  BackHandler
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import CustomAlert from '../src/components/CustomAlert'; 

const KEY_REMEMBER_ME = 'userCredentials';

const GTH_LOGO = require('../assets/logo.png'); 
const LOGIN_BACKGROUND_IMAGE = require('../assets/login.jpg');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem(KEY_REMEMBER_ME);
        if (storedCredentials) {
          const { storedEmail, storedPassword } = JSON.parse(storedCredentials);
          setEmail(storedEmail || '');
          setPassword(storedPassword || '');
          setRememberMe(true); 
        }
      } catch (error) {
        console.error("Error cargando credenciales:", error);
      }
    };
    loadCredentials();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("", "Por favor, complete todos los campos.");
      return;
    }
    
    if (rememberMe) {
      try {
        await AsyncStorage.setItem(KEY_REMEMBER_ME, JSON.stringify({ storedEmail: email, storedPassword: password }));
      } catch (error) {
        console.error("Error guardando credenciales:", error);
      }
    } else {
      try {
        await AsyncStorage.removeItem(KEY_REMEMBER_ME);
      } catch (error) {
        console.error("Error eliminando credenciales:", error);
      }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      let errorMessage = "Credenciales inválidas.";

      if (error.code === 'auth/network-request-failed') {
        errorMessage = "Error de red. Por favor, comprueba tu conexión.";
      }

      showAlert("", errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <ImageBackground source={LOGIN_BACKGROUND_IMAGE} style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} /> 

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentBox}>
            
            <Image source={GTH_LOGO} style={styles.logo} />
            <Text style={styles.title}>Iniciar Sesión</Text>

            <View style={styles.inputGroup}>
              <FontAwesome name="envelope" size={20} color="#b9770e" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#CCCCCC"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#CCCCCC"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#CCCCCC" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  style={styles.checkbox}
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  color={rememberMe ? '#b9770e' : '#CCCCCC'}
                />
                <Text style={styles.checkboxLabel}>Recordar</Text>
              </View>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu Contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>
                <Text style={styles.normalText}>¿No tenés una cuenta? </Text>
                <Text style={styles.boldText}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
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
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentBox: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 25,
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    height: 50,
  },
  icon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#b9770e',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#b9770e',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#b9770e',
    fontSize: 16,
  },
  normalText: {
    fontWeight: 'normal',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
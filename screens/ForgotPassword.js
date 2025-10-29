import React, { useState } from 'react';
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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import CustomAlert from '../src/components/CustomAlert';

const GTH_LOGO = require('../assets/logo.png');
const LOGIN_BACKGROUND_IMAGE = require('../assets/login.jpg');

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Validación de formato de email usando regex
  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSendResetEmail = async () => {
    // Validación de presencia
    if (!email.trim()) {
      showAlert('Campo requerido', 'Por favor, ingrese su correo electrónico.');
      return;
    }

    // Validación de formato
    if (!validateEmailFormat(email.trim())) {
      showAlert('Formato inválido', 'Por favor, ingrese un formato de correo válido.');
      return;
    }

    try {
      // Firebase envía el email de recuperación
      // Importante: Firebase maneja la seguridad automáticamente
      // No revela si el email existe o no (previene enumeración de usuarios)
      await sendPasswordResetEmail(auth, email.trim());

      // Mensaje estándar de la industria - no confirma ni niega si el email existe
      showAlert(
        'Solicitud enviada',
        'Se ha enviado un enlace a su correo. Si su cuenta existe, recibirá las instrucciones para restablecer su contraseña. Por favor, revise su bandeja de entrada y la casilla de spam.'
      );

      // Limpiar el campo después de enviar
      setEmail('');
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);

      // Manejo de errores genéricos sin revelar información sensible
      let errorMessage = 'Hubo un problema al procesar su solicitud. Por favor, intente nuevamente más tarde.';

      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de red. Por favor, comprueba tu conexión.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos. Por favor, espere unos minutos antes de intentar nuevamente.';
      }

      showAlert('Error', errorMessage);
    }
  };

  // El botón solo se habilita si el email tiene un formato válido
  const isButtonDisabled = !email.trim() || !validateEmailFormat(email.trim());

  return (
    <ImageBackground source={LOGIN_BACKGROUND_IMAGE} style={styles.background}>
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentBox}>
            <Image source={GTH_LOGO} style={styles.logo} />

            <View style={styles.headerContainer}>
              <FontAwesome name="key" size={50} color="#b9770e" />
              <Text style={styles.title}>Recuperar Contraseña</Text>
              <Text style={styles.subtitle}>
                Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
              </Text>
            </View>

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

            <TouchableOpacity
              style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
              onPress={handleSendResetEmail}
              disabled={isButtonDisabled}
            >
              <FontAwesome
                name="send"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="arrow-left" size={16} color="#b9770e" style={{ marginRight: 8 }} />
              <Text style={styles.backButtonText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>

            {/* Información de seguridad */}
            <View style={styles.infoBox}>
              <FontAwesome name="info-circle" size={16} color="#b9770e" style={{ marginRight: 10 }} />
              <Text style={styles.infoText}>
                Por seguridad, no confirmamos si un correo está registrado en nuestro sistema.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          // Si el título es "Solicitud enviada", volver al login
          if (alertTitle === 'Solicitud enviada') {
            navigation.goBack();
          }
        }}
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
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 25,
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
  button: {
    flexDirection: 'row',
    backgroundColor: '#b9770e',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#b9770e',
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(185, 119, 14, 0.1)',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#b9770e',
  },
  infoText: {
    flex: 1,
    color: '#CCCCCC',
    fontSize: 12,
    lineHeight: 18,
  },
});
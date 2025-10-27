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
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import CustomAlert from '../src/components/CustomAlert';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/config/firebaseConfig";

const GTH_LOGO = require('../assets/logo.png');
const SIGNUP_BACKGROUND_IMAGE = require('../assets/signup.jpg');

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const isLengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const allRequirementsMet = isLengthValid && hasUpperCase && hasLowerCase && hasNumber;
  const isFirstNameValid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName) && firstName.length > 0;
  const isLastNameValid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName) && lastName.length > 0;
  const hasAtSymbol = email.includes('@');
  const hasDotCom = email.includes('.com');
  const isEmailValid = hasAtSymbol && hasDotCom;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleNameInput = (text, setter) => {
    const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setter(filteredText);
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showAlert("", "Todos los campos son obligatorios.");
      return;
    }

    if (!isFirstNameValid) {
      showAlert("", "El nombre solo puede contener letras y espacios.");
      return;
    }

    if (!isLastNameValid) {
      showAlert("", "El apellido solo puede contener letras y espacios.");
      return;
    }

    if (!isEmailValid) {
      showAlert("", "Ingrese un correo electrónico válido.");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("", "Las contraseñas no coinciden.");
      return;
    }

    if (!allRequirementsMet) {
      showAlert("", "La contraseña debe cumplir con todos los requisitos de seguridad.");
      return;
    }

    try {
      // Crear usuario en Authentication
      const response = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre completo
      await updateProfile(response.user, {
        displayName: `${firstName} ${lastName}`
      });

      // Guardar datos del empleado en Firestore
      await setDoc(doc(db, "empleados", response.user.uid), {
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        email: email.trim(),
        activo: true,
        fechaIngreso: new Date().toISOString().split('T')[0],
        telefono: "",
        puesto: "",
        fechaNacimiento: "",
        ubicacion: "",
        tareasCompletadas: 0,
        tareasAsignadas: 0,
        notas: "",
        imagen: ""
      });

      // Cerrar sesión inmediatamente después del registro
      await signOut(auth);
      
      showAlert("Registro exitoso", "Tu cuenta ha sido creada. Por favor inicia sesión.");
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
      
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El correo electrónico ingresado no es válido.";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "Este correo electrónico ya está en uso.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Problema de conexión. Revise su internet.";
          break;
      }
      showAlert("Error", errorMessage);
    }
  };

  const PasswordRequirement = ({ isValid, children }) => (
    <Text style={[styles.requirementText, isValid ? styles.validRequirement : styles.invalidRequirement]}>
      {children}
    </Text>
  );

  const InfoRequirement = ({ children }) => (
    <Text style={styles.infoText}>
      {children}
    </Text>
  );

  const EmailRequirement = ({ isValid, children }) => (
    <Text style={[styles.requirementText, isValid ? styles.validRequirement : styles.invalidRequirement]}>
      {children}
    </Text>
  );

  return (
    <ImageBackground source={SIGNUP_BACKGROUND_IMAGE} style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentBox}>
            <Image source={GTH_LOGO} style={styles.logo} />
            <Text style={styles.title}>Crear Cuenta</Text>

            <View style={styles.inputGroup}>
              <FontAwesome name="user" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#999999"
                value={firstName}
                onChangeText={(text) => handleNameInput(text, setFirstName)}
                onFocus={() => setIsFirstNameFocused(true)}
                onBlur={() => setIsFirstNameFocused(false)}
              />
            </View>
            {isFirstNameFocused && (
              <View style={styles.nameRequirements}>
                <InfoRequirement>Se permite letras (A-Z, a-z), acentos y espacios</InfoRequirement>
              </View>
            )}

            <View style={styles.inputGroup}>
              <FontAwesome name="user" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#999999"
                value={lastName}
                onChangeText={(text) => handleNameInput(text, setLastName)}
                onFocus={() => setIsLastNameFocused(true)}
                onBlur={() => setIsLastNameFocused(false)}
              />
            </View>
            {isLastNameFocused && (
              <View style={styles.nameRequirements}>
                <InfoRequirement>Se permite letras (A-Z, a-z), acentos y espacios</InfoRequirement>
              </View>
            )}

            <View style={styles.inputGroup}>
              <FontAwesome name="envelope" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </View>
            {isEmailFocused && !isEmailValid && (
              <View style={styles.emailRequirements}>
                <InfoRequirement>Ingrese un correo electrónico válido (ejemplo@gmail.com)</InfoRequirement>
              </View>
            )}

            <View style={styles.inputGroup}>
              <FontAwesome name="lock" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#CCCCCC" />
              </TouchableOpacity>
            </View>
            {isPasswordFocused && (
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementTitle}>La contraseña debe contener:</Text>
                <PasswordRequirement isValid={isLengthValid}>8 carácteres como mínimo</PasswordRequirement>
                <PasswordRequirement isValid={hasUpperCase}>Una mayúscula</PasswordRequirement>
                <PasswordRequirement isValid={hasLowerCase}>Una minúscula</PasswordRequirement>
                <PasswordRequirement isValid={hasNumber}>Un número</PasswordRequirement>
              </View>
            )}

            <View style={styles.inputGroup}>
              <FontAwesome name="lock" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar Contraseña"
                placeholderTextColor="#999999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#CCCCCC" />
              </TouchableOpacity>
            </View>
            {isConfirmPasswordFocused && !passwordsMatch && (
              <View style={styles.confirmPasswordRequirements}>
                <InfoRequirement>Las contraseñas no coinciden</InfoRequirement>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.normalText}>
                ¿Ya tenés cuenta?{' '}
                <Text style={styles.signUpText}>Inicia sesión</Text>
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
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  nameRequirements: {
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 5,
  },
  emailRequirements: {
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 5,
  },
  passwordRequirements: {
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 5,
  },
  confirmPasswordRequirements: {
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 5,
  },
  requirementTitle: {
    color: '#CCCCCC',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requirementText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 3,
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 3,
  },
  validRequirement: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  invalidRequirement: {
    color: '#bebebeff',
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
    color: '#FFFFFF',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

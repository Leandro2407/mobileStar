import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Validaciones
  const isLengthValid = passwords.newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwords.newPassword);
  const hasLowerCase = /[a-z]/.test(passwords.newPassword);
  const hasNumber = /\d/.test(passwords.newPassword);
  const allRequirementsMet = isLengthValid && hasUpperCase && hasLowerCase && hasNumber;
  const passwordsMatch = passwords.newPassword === passwords.confirmPassword && passwords.confirmPassword.length > 0;

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    if (!allRequirementsMet) {
      Alert.alert('Error', 'La nueva contraseña debe cumplir con todos los requisitos de seguridad.');
      return;
    }
    if (!passwordsMatch) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No se ha encontrado un usuario.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, passwords.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.newPassword);

      Alert.alert('Éxito', 'Contraseña cambiada correctamente');

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'La contraseña actual es incorrecta.');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'La contraseña actual es incorrecta.');
      } else {
        Alert.alert('Error', 'Ocurrió un error al cambiar la contraseña. Inténtalo de nuevo.');
      }
      console.log(error);
    }
  };

  // COMPONENTE CORREGIDO: PasswordRequirement
  const PasswordRequirement = ({ isValid, children }) => (
    <View style={styles.requirementRow}>
      <FontAwesome 
        name={isValid ? "check-circle" : "times-circle"}
        size={14} 
        color={isValid ? '#2ecc71' : '#bebebeff'} 
        style={styles.requirementIcon}
      />
      <Text style={[styles.requirementText, isValid && styles.validRequirement, !isValid && styles.invalidRequirement]}>
        {children}
      </Text>
    </View>
  );

  // COMPONENTE CORREGIDO: ConfirmRequirement
  const ConfirmRequirement = ({ isValid, children }) => (
    <View style={styles.requirementRow}>
      <FontAwesome 
        name={isValid ? "check-circle" : "times-circle"}
        size={14} 
        color={isValid ? '#2ecc71' : '#bebebeff'} 
        style={styles.requirementIcon}
      />
      <Text style={[styles.requirementText, isValid && styles.validRequirement, !isValid && styles.invalidRequirement]}>
        {children}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
        
        {/* Contraseña Actual */}
        <View style={styles.inputGroup}>
          <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña Actual"
            placeholderTextColor="#CCCCCC"
            secureTextEntry
            value={passwords.currentPassword}
            onChangeText={(text) => setPasswords({...passwords, currentPassword: text})}
          />
        </View>
        
        {/* Nueva Contraseña */}
        <View style={styles.inputGroup}>
          <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nueva Contraseña"
            placeholderTextColor="#CCCCCC"
            secureTextEntry={!showNewPassword}
            value={passwords.newPassword}
            onChangeText={(text) => setPasswords({...passwords, newPassword: text})}
            onFocus={() => setIsNewPasswordFocused(true)}
            onBlur={() => setIsNewPasswordFocused(false)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNewPassword(!showNewPassword)}>
            <FontAwesome name={showNewPassword ? "eye-slash" : "eye"} size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* Requisitos de contraseña */}
        {isNewPasswordFocused && (
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementTitle}>La contraseña debe contener:</Text>
            <PasswordRequirement isValid={isLengthValid}>8 caracteres como mínimo</PasswordRequirement>
            <PasswordRequirement isValid={hasUpperCase}>Una mayúscula</PasswordRequirement>
            <PasswordRequirement isValid={hasLowerCase}>Una minúscula</PasswordRequirement>
            <PasswordRequirement isValid={hasNumber}>Un número</PasswordRequirement>
          </View>
        )}
        
        {/* Confirmar Nueva Contraseña */}
        <View style={styles.inputGroup}>
          <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Nueva Contraseña"
            placeholderTextColor="#CCCCCC"
            secureTextEntry={!showConfirmPassword}
            value={passwords.confirmPassword}
            onChangeText={(text) => setPasswords({...passwords, confirmPassword: text})}
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() => setIsConfirmPasswordFocused(false)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* Validación de coincidencia */}
        {isConfirmPasswordFocused && !passwordsMatch && (
          <View style={styles.confirmPasswordRequirements}>
            <ConfirmRequirement isValid={passwordsMatch}>
              Las contraseñas no coinciden
            </ConfirmRequirement>
          </View>
        )}
        
        {/* Botón para cambiar la contraseña */}
        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={styles.saveButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
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
  // ESTILOS CORREGIDOS: Agregado requirementRow
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    color: '#CCCCCC',
    fontSize: 14,
    flex: 1,
  },
  validRequirement: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  invalidRequirement: {
    color: '#bebebeff',
  },
  saveButton: {
    backgroundColor: '#b9770e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePassword;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import CustomAlert from '../src/components/CustomAlert';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

  // Validaciones
  const isLengthValid = passwords.newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwords.newPassword);
  const hasLowerCase = /[a-z]/.test(passwords.newPassword);
  const hasNumber = /\d/.test(passwords.newPassword);
  const allRequirementsMet = isLengthValid && hasUpperCase && hasLowerCase && hasNumber;
  const passwordsMatch = passwords.newPassword === passwords.confirmPassword && passwords.confirmPassword.length > 0;

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    if (!allRequirementsMet) {
      showAlert('Error', 'La nueva contraseña debe cumplir con todos los requisitos de seguridad.');
      return;
    }
    if (!passwordsMatch) {
      showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      showAlert('Error', 'No se ha encontrado un usuario.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, passwords.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwords.newPassword);

      showAlert('Éxito', 'Contraseña cambiada correctamente');

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        showAlert('Error', 'La contraseña actual es incorrecta.');
      } else if (error.code === 'auth/invalid-credential') {
        showAlert('Error', 'La contraseña actual es incorrecta.');
      } else {
        showAlert('Error', 'Ocurrió un error al cambiar la contraseña. Inténtalo de nuevo.');
      }
      console.log(error);
    }
  };

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
        
        {/* Contraseña Actual - CON BOTÓN DE OJO */}
        <View style={styles.inputGroup}>
          <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña Actual"
            placeholderTextColor="#CCCCCC"
            secureTextEntry={!showCurrentPassword}
            value={passwords.currentPassword}
            onChangeText={(text) => setPasswords({...passwords, currentPassword: text})}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <FontAwesome name={showCurrentPassword ? "eye-slash" : "eye"} size={20} color="#CCCCCC" />
          </TouchableOpacity>
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

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
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
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#b9770e',
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
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  confirmPasswordRequirements: {
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  requirementTitle: {
    color: '#CCCCCC',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 14,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIcon: {
    marginRight: 10,
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
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePassword;
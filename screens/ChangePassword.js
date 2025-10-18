import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = () => {
    // Aquí iría la lógica para cambiar contraseña en Firebase
    Alert.alert('Éxito', 'Contraseña cambiada correctamente');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña Actual</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña actual"
            secureTextEntry
            value={passwords.currentPassword}
            onChangeText={(text) => setPasswords({...passwords, currentPassword: text})}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nueva contraseña"
            secureTextEntry
            value={passwords.newPassword}
            onChangeText={(text) => setPasswords({...passwords, newPassword: text})}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirma tu nueva contraseña"
            secureTextEntry
            value={passwords.confirmPassword}
            onChangeText={(text) => setPasswords({...passwords, confirmPassword: text})}
          />
        </View>
        
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
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
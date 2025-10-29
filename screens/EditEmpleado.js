import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';
import CustomAlert from '../src/components/CustomAlert';
import * as ImagePicker from 'expo-image-picker';

const BACKGROUND_IMAGE = require('../assets/signup.jpg');

export default function EditEmpleado({ route, navigation }) {
  const { empleado } = route.params;

  const [nombre, setNombre] = useState(empleado.nombre || '');
  const [apellido, setApellido] = useState(empleado.apellido || '');
  const [email, setEmail] = useState(empleado.email || '');
  const [telefono, setTelefono] = useState(empleado.telefono || '');
  const [puesto, setPuesto] = useState(empleado.puesto || '');
  const [dni, setDni] = useState(empleado.dni || '');
  const [barrio, setBarrio] = useState(empleado.barrio || '');
  const [calle, setCalle] = useState(empleado.calle || '');
  const [numeroDomicilio, setNumeroDomicilio] = useState(empleado.numeroDomicilio || '');
  const [notas, setNotas] = useState(empleado.notas || '');
  const [activo, setActivo] = useState(empleado.activo !== undefined ? empleado.activo : true);
  const [profileImage, setProfileImage] = useState(empleado.imagen || null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  const handleNameInput = (text, setter) => {
    const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setter(filteredText);
  };

  const handleDniInput = (text) => {
    // Solo permite números y máximo 9 caracteres
    const filteredText = text.replace(/[^0-9]/g, '').slice(0, 9);
    setDni(filteredText);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert('Permiso requerido', 'Se necesita acceso a la galería para cambiar la foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      showAlert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const getInitials = () => {
    if (!nombre || !apellido) return 'EM';
    return (nombre[0] + apellido[0]).toUpperCase();
  };

  const handleUpdateEmpleado = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      showAlert('Campos obligatorios', 'El nombre y apellido son obligatorios.');
      return;
    }

    try {
      // Construir domicilio
      let domicilio = '';
      if (barrio || calle || numeroDomicilio) {
        const partes = [];
        if (calle) partes.push(calle);
        if (numeroDomicilio) partes.push(numeroDomicilio);
        if (barrio) partes.push(`Barrio ${barrio}`);
        domicilio = partes.join(', ');
      }

      const empleadoRef = doc(db, 'empleados', empleado.id);
      await updateDoc(empleadoRef, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim() || '',
        telefono: telefono.trim() || '',
        puesto: puesto.trim() || '',
        // fechaIngreso NO se actualiza - permanece como está
        dni: dni.trim() || '',
        barrio: barrio.trim() || '',
        calle: calle.trim() || '',
        numeroDomicilio: numeroDomicilio.trim() || '',
        domicilio: domicilio || 'No registrado',
        notas: notas.trim() || '',
        activo: activo,
        imagen: profileImage || '',
        updatedAt: new Date().toISOString(),
      });

      showAlert('Éxito', 'Empleado actualizado correctamente.');
      setTimeout(() => {
        setAlertVisible(false);
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      showAlert('Error', 'No se pudo actualizar el empleado. Intenta de nuevo.');
    }
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentBox}>
            <View style={styles.headerContainer}>
              <FontAwesome name="edit" size={50} color="#b9770e" />
              <Text style={styles.title}>Editar Empleado</Text>
            </View>

            {/* Foto de Perfil */}
            <View style={styles.profileImageSection}>
              <TouchableOpacity onPress={pickImage}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Text style={styles.profileInitials}>{getInitials()}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <FontAwesome name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.profileImageHint}>Tocar para cambiar foto</Text>
            </View>

            {/* Estado Activo/Inactivo */}
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Estado:</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[styles.statusButton, activo && styles.statusButtonActive]}
                  onPress={() => setActivo(true)}
                >
                  <FontAwesome 
                    name="check-circle" 
                    size={20} 
                    color={activo ? "#27ae60" : "#666"} 
                  />
                  <Text style={[styles.statusButtonText, activo && styles.statusButtonTextActive]}>
                    Activo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusButton, !activo && styles.statusButtonInactive]}
                  onPress={() => setActivo(false)}
                >
                  <FontAwesome 
                    name="times-circle" 
                    size={20} 
                    color={!activo ? "#e74c3c" : "#666"} 
                  />
                  <Text style={[styles.statusButtonText, !activo && styles.statusButtonTextInactive]}>
                    Inactivo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <FontAwesome name="user" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre *"
                placeholderTextColor="#999999"
                value={nombre}
                onChangeText={(text) => handleNameInput(text, setNombre)}
              />
            </View>

            {/* Apellido */}
            <View style={styles.inputGroup}>
              <FontAwesome name="user" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido *"
                placeholderTextColor="#999999"
                value={apellido}
                onChangeText={(text) => handleNameInput(text, setApellido)}
              />
            </View>

            {/* DNI */}
            <View style={styles.inputGroup}>
              <FontAwesome name="id-card" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="DNI (máx. 9 dígitos)"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                value={dni}
                onChangeText={handleDniInput}
                maxLength={9}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <FontAwesome name="envelope" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Teléfono */}
            <View style={styles.inputGroup}>
              <FontAwesome name="phone" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={setTelefono}
              />
            </View>

            {/* Puesto */}
            <View style={styles.inputGroup}>
              <FontAwesome name="briefcase" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Puesto"
                placeholderTextColor="#999999"
                value={puesto}
                onChangeText={setPuesto}
              />
            </View>

            {/* Fecha de Ingreso (NO EDITABLE) */}
            <View style={[styles.inputGroup, styles.disabledInput]}>
              <FontAwesome name="calendar" size={20} color="#666666" style={styles.icon} />
              <View style={styles.lockedDateContainer}>
                <Text style={styles.lockedDateLabel}>Fecha de Ingreso (No modificable)</Text>
                <Text style={styles.lockedDateValue}>
                  {empleado.fechaIngreso || 'No registrada'}
                </Text>
              </View>
              <FontAwesome name="lock" size={16} color="#666666" />
            </View>

            {/* Sección de Domicilio */}
            <Text style={styles.subsectionTitle}>Domicilio</Text>

            {/* Barrio */}
            <View style={styles.inputGroup}>
              <FontAwesome name="map-marker" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Barrio"
                placeholderTextColor="#999999"
                value={barrio}
                onChangeText={setBarrio}
              />
            </View>

            {/* Calle */}
            <View style={styles.inputGroup}>
              <FontAwesome name="road" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Calle"
                placeholderTextColor="#999999"
                value={calle}
                onChangeText={setCalle}
              />
            </View>

            {/* Número de Domicilio */}
            <View style={styles.inputGroup}>
              <FontAwesome name="home" size={20} color="#CCCCCC" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Número de Domicilio"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                value={numeroDomicilio}
                onChangeText={setNumeroDomicilio}
              />
            </View>

            {/* Notas */}
            <View style={[styles.inputGroup, styles.textAreaGroup]}>
              <FontAwesome name="sticky-note" size={20} color="#CCCCCC" style={[styles.icon, styles.textAreaIcon]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notas adicionales"
                placeholderTextColor="#999999"
                multiline
                numberOfLines={4}
                value={notas}
                onChangeText={setNotas}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdateEmpleado}>
              <FontAwesome name="save" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#b9770e',
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#b9770e',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#b9770e',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 25,
    right: -10,
    backgroundColor: '#b9770e',
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  profileImageHint: {
    color: '#999999',
    fontSize: 12,
    marginTop: 8,
  },
  statusContainer: {
    width: '100%',
    marginBottom: 20,
  },
  statusLabel: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444444',
    gap: 8,
  },
  statusButtonActive: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    borderColor: '#27ae60',
  },
  statusButtonInactive: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderColor: '#e74c3c',
  },
  statusButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusButtonTextActive: {
    color: '#27ae60',
  },
  statusButtonTextInactive: {
    color: '#e74c3c',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b9770e',
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
    minHeight: 50,
  },
  disabledInput: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
  },
  textAreaGroup: {
    alignItems: 'flex-start',
    minHeight: 100,
    paddingVertical: 15,
  },
  icon: {
    marginRight: 15,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  lockedDateContainer: {
    flex: 1,
  },
  lockedDateLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  lockedDateValue: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#b9770e',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
});
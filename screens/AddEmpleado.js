import React, { useState, useEffect } from 'react';
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
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';
import CustomAlert from '../src/components/CustomAlert';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const BACKGROUND_IMAGE = require('../assets/signup.jpg');

export default function AddEmpleado({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [puesto, setPuesto] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [barrio, setBarrio] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroDomicilio, setNumeroDomicilio] = useState('');
  const [notas, setNotas] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
  
  // Estados para el DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Establecer la fecha de ingreso automáticamente al cargar el componente
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    setFechaIngreso(formattedDate);
  }, []);

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  const handleNameInput = (text, setter) => {
    const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setter(filteredText);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      setFechaNacimiento(formattedDate);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar una foto.');
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

  const handleAddEmpleado = async () => {
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

      await addDoc(collection(db, 'empleados'), {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim() || '',
        telefono: telefono.trim() || '',
        puesto: puesto.trim() || '',
        fechaIngreso: fechaIngreso,
        fechaNacimiento: fechaNacimiento.trim() || '',
        barrio: barrio.trim() || '',
        calle: calle.trim() || '',
        numeroDomicilio: numeroDomicilio.trim() || '',
        domicilio: domicilio || 'No registrado',
        notas: notas.trim() || '',
        activo: true,
        imagen: profileImage || '',
        createdAt: new Date().toISOString(),
      });

      showAlert('Éxito', 'Empleado agregado correctamente.');
      setTimeout(() => {
        setAlertVisible(false);
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      showAlert('Error', 'No se pudo agregar el empleado. Intenta de nuevo.');
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
              <FontAwesome name="user-plus" size={50} color="#b9770e" />
              <Text style={styles.title}>Agregar Empleado</Text>
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
              <Text style={styles.profileImageHint}>Tocar para agregar foto</Text>
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

            {/* Fecha de Ingreso (Automática - Solo lectura) */}
            <View style={styles.inputGroup}>
              <FontAwesome name="calendar" size={20} color="#27ae60" style={styles.icon} />
              <View style={styles.autoDateContainer}>
                <Text style={styles.autoDateLabel}>Fecha de Ingreso (Automática)</Text>
                <Text style={styles.autoDateValue}>{fechaIngreso}</Text>
              </View>
            </View>

            {/* Fecha de Nacimiento con Calendar Picker */}
            <TouchableOpacity 
              style={styles.inputGroup}
              onPress={() => setShowDatePicker(true)}
            >
              <FontAwesome name="birthday-cake" size={20} color="#CCCCCC" style={styles.icon} />
              <View style={styles.datePickerButton}>
                <Text style={fechaNacimiento ? styles.datePickerTextFilled : styles.datePickerText}>
                  {fechaNacimiento || 'Fecha de Nacimiento (Tocar para seleccionar)'}
                </Text>
              </View>
              <FontAwesome name="calendar" size={18} color="#b9770e" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor="#FFFFFF"
              />
            )}

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

            <TouchableOpacity style={styles.button} onPress={handleAddEmpleado}>
              <FontAwesome name="check" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Agregar Empleado</Text>
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
  autoDateContainer: {
    flex: 1,
  },
  autoDateLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  autoDateValue: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  datePickerButton: {
    flex: 1,
    justifyContent: 'center',
  },
  datePickerText: {
    color: '#999999',
    fontSize: 16,
  },
  datePickerTextFilled: {
    color: '#FFFFFF',
    fontSize: 16,
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
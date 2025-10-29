import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Platform, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import CustomAlert from '../src/components/CustomAlert';
import DateTimePicker from '@react-native-community/datetimepicker'; 

const InputField = ({ icon, label, value, onChangeText, placeholder, keyboardType = 'default', editable = true, onPress }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TouchableOpacity 
        style={styles.inputGroup} 
        onPress={onPress} 
        activeOpacity={onPress ? 0.7 : 1}
        disabled={!onPress && editable}
    >
      <FontAwesome name={icon} size={20} color={editable ? "#b9770e" : "#555"} style={styles.icon} />
      <TextInput
        style={[styles.input, !editable && styles.uneditableInput]}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable && !onPress}
        onPressIn={onPress}
      />
    </TouchableOpacity>
  </View>
);

const EditInformation = ({ navigation }) => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fechaNacimiento: '',
    barrio: '',
    calle: '',
    numero: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
  const [confirmSaveVisible, setConfirmSaveVisible] = useState(false);
  const [confirmBackVisible, setConfirmBackVisible] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const backHandler = navigation.addListener('beforeRemove', (e) => {
      const hasChanges = JSON.stringify(userData) !== JSON.stringify(originalData);
      
      if (hasChanges) {
        e.preventDefault();
        setConfirmBackVisible(true);
      }
    });

    return backHandler;
  }, [navigation, userData, originalData]);

  const loadUserData = async () => {
    try {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.exists() ? userDoc.data() : {};
        
        const initialData = {
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            telefono: data.telefono || '',
            fechaNacimiento: data.fechaNacimiento || '',
            barrio: data.barrio || '',
            calle: data.calle || '',
            numero: data.numero || '',
        };
        
        setUserData(initialData);
        setOriginalData(initialData);
        
        if (data.fechaNacimiento) {
            const [day, month, year] = data.fechaNacimiento.split('/').map(Number);
            if (year && month && day) {
                setDate(new Date(year, month - 1, day));
            }
        }
      }
    } catch (error) {
      console.log('Error cargando datos:', error);
    }
  };

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  const handleSaveRequest = () => {
    if (!userData.nombre.trim() || !userData.apellido.trim() || !userData.telefono.trim() || !userData.fechaNacimiento.trim()) {
      showAlert('Error', 'Nombre, Apellido, Teléfono y Fecha de Nacimiento son obligatorios.');
      return;
    }

    if (userData.telefono && !/^\d+$/.test(userData.telefono)) {
      showAlert('Error', 'El teléfono debe contener solo números.');
      return;
    }

    setConfirmSaveVisible(true);
  };

  const handleSaveConfirm = async () => {
    setConfirmSaveVisible(false);
    
    try {
      const fullName = `${userData.nombre} ${userData.apellido}`;
      await updateProfile(user, { displayName: fullName });
      
      let domicilio = '';
      if (userData.barrio || userData.calle || userData.numero) {
        const partes = [];
        if (userData.calle) partes.push(userData.calle);
        if (userData.numero) partes.push(userData.numero);
        if (userData.barrio) partes.push(`Barrio ${userData.barrio}`);
        domicilio = partes.join(', ');
      }
      
      const dataToSave = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        fechaNacimiento: userData.fechaNacimiento,
        barrio: userData.barrio,
        calle: userData.calle,
        numero: userData.numero,
        domicilio: domicilio || 'No registrado',
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', user.uid), dataToSave, { merge: true });
      setOriginalData(dataToSave);
      
      showAlert('Éxito', 'Datos guardados correctamente');
      
      // Volver a la pantalla de perfil después de 1 segundo
      setTimeout(() => {
        navigation.navigate('Profile');
      }, 1000);
    } catch (error) {
      console.error('Error al guardar:', error);
      showAlert('Error', 'No se pudieron guardar los cambios');
    }
  };

  const handleBackConfirm = () => {
    setConfirmBackVisible(false);
    navigation.navigate('Profile');
  };
  
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
    }
    
    setDate(currentDate);
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    setUserData(prev => ({ ...prev, fechaNacimiento: formattedDate }));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.section}>
        <Text style={styles.sectionTitle}>Editar Información Personal</Text>

        <InputField
          icon="user"
          label="Nombre"
          placeholder="Ingresa tu nombre"
          value={userData.nombre}
          onChangeText={(text) => setUserData({...userData, nombre: text})}
        />

        <InputField
          icon="user"
          label="Apellido"
          placeholder="Ingresa tu apellido"
          value={userData.apellido}
          onChangeText={(text) => setUserData({...userData, apellido: text})}
        />

        <InputField
          icon="envelope"
          label="Correo Electrónico"
          placeholder="Tu email de usuario"
          value={user?.email || ''}
          editable={false}
        />

        <InputField
          icon="phone"
          label="Número de Teléfono"
          placeholder="Ingresa tu teléfono"
          keyboardType="phone-pad"
          value={userData.telefono}
          onChangeText={(text) => setUserData({...userData, telefono: text})}
        />

        <InputField
          icon="calendar"
          label="Fecha de Nacimiento"
          placeholder="DD/MM/AAAA"
          value={userData.fechaNacimiento}
          editable={true}
          onPress={() => setShowDatePicker(true)}
        />
        
        {showDatePicker && Platform.OS === 'android' && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
            />
        )}
        
        <Text style={styles.subsectionTitle}>Domicilio</Text>

        <InputField
          icon="map-marker"
          label="Barrio"
          placeholder="Ingresa tu barrio"
          value={userData.barrio}
          onChangeText={(text) => setUserData({...userData, barrio: text})}
        />

        <InputField
          icon="road"
          label="Calle"
          placeholder="Ingresa la calle"
          value={userData.calle}
          onChangeText={(text) => setUserData({...userData, calle: text})}
        />

        <InputField
          icon="home"
          label="Número de Domicilio"
          placeholder="Número"
          keyboardType="numeric"
          value={userData.numero}
          onChangeText={(text) => setUserData({...userData, numero: text})}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRequest}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
        
        <View style={{ height: 30 }} />

      </ScrollView>

      {showDatePicker && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                textColor="#ffffff"
                maximumDate={new Date()}
              />
              <TouchableOpacity style={styles.datePickerDoneButton} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerDoneText}>Confirmar Fecha</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={confirmSaveVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmSaveVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <FontAwesome name="question-circle" size={50} color="#b9770e" style={styles.alertIcon} />
            <Text style={styles.alertTitle}>Confirmar cambios</Text>
            <Text style={styles.alertMessage}>Verifica si los datos ingresados son los correctos.</Text>
            
            <View style={styles.alertButtons}>
              <TouchableOpacity 
                style={[styles.alertButton, styles.cancelButton]}
                onPress={() => setConfirmSaveVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.alertButton, styles.confirmButton]}
                onPress={handleSaveConfirm}
              >
                <Text style={styles.confirmButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmBackVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmBackVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <FontAwesome name="exclamation-triangle" size={50} color="#b9770e" style={styles.alertIcon} />
            <Text style={styles.alertTitle}>Advertencia</Text>
            <Text style={styles.alertMessage}>¿Estás seguro que deseas salir sin guardar cambios?</Text>
            
            <View style={styles.alertButtons}>
              <TouchableOpacity 
                style={[styles.alertButton, styles.cancelButton]}
                onPress={() => setConfirmBackVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.alertButton, styles.confirmButton]}
                onPress={handleBackConfirm}
              >
                <Text style={styles.confirmButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomAlert 
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
    </View>
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#b9770e',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '600',
    marginBottom: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    borderWidth: 1, 
    borderColor: '#2a2a2a',
  },
  icon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
    paddingVertical: 0,
  },
  uneditableInput: {
    color: '#999999',
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
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 25,
    width: Dimensions.get('window').width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  alertIcon: {
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 25,
  },
  alertButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  alertButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  confirmButton: {
    backgroundColor: '#b9770e',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  datePickerContainer: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 10,
    alignItems: 'center',
  },
  datePickerDoneButton: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#333333',
  },
  datePickerDoneText: {
    color: '#b9770e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditInformation;
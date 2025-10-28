import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import CustomAlert from '../src/components/CustomAlert';

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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
  const [confirmSaveVisible, setConfirmSaveVisible] = useState(false);
  const [confirmBackVisible, setConfirmBackVisible] = useState(false);

  useEffect(() => {
    loadUserData();
    
    const backHandler = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      setConfirmBackVisible(true);
    });

    return backHandler;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            telefono: data.telefono || '',
            fechaNacimiento: data.fechaNacimiento || '',
            barrio: data.barrio || '',
            calle: data.calle || '',
            numero: data.numero || '',
          });
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
    if (!userData.nombre.trim() || !userData.apellido.trim()) {
      showAlert('Error', 'El nombre y apellido son obligatorios.');
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
      
      // Construir domicilio completo
      let domicilio = '';
      if (userData.barrio || userData.calle || userData.numero) {
        const partes = [];
        if (userData.calle) partes.push(userData.calle);
        if (userData.numero) partes.push(userData.numero);
        if (userData.barrio) partes.push(`Barrio ${userData.barrio}`);
        domicilio = partes.join(', ');
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        fechaNacimiento: userData.fechaNacimiento,
        barrio: userData.barrio,
        calle: userData.calle,
        numero: userData.numero,
        domicilio: domicilio || 'No registrado',
        updatedAt: new Date(),
      }, { merge: true });

      showAlert('Éxito', 'Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      showAlert('Error', 'No se pudieron guardar los cambios');
    }
  };

  const handleBackConfirm = () => {
    setConfirmBackVisible(false);
    // Remover el listener antes de navegar
    navigation.setOptions({
      gestureEnabled: true
    });
    // La acción de volver funciona correctamente
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.section}>
        <Text style={styles.sectionTitle}>Editar Información</Text>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <FontAwesome name="user" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#666"
            value={userData.nombre}
            onChangeText={(text) => setUserData({...userData, nombre: text})}
          />
        </View>

        {/* Apellido */}
        <View style={styles.inputGroup}>
          <FontAwesome name="user" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#666"
            value={userData.apellido}
            onChangeText={(text) => setUserData({...userData, apellido: text})}
          />
        </View>

        {/* Teléfono */}
        <View style={styles.inputGroup}>
          <FontAwesome name="phone" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={userData.telefono}
            onChangeText={(text) => setUserData({...userData, telefono: text})}
          />
        </View>

        {/* Fecha de Nacimiento */}
        <View style={styles.inputGroup}>
          <FontAwesome name="calendar" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Fecha de Nacimiento (DD/MM/AAAA)"
            placeholderTextColor="#666"
            value={userData.fechaNacimiento}
            onChangeText={(text) => setUserData({...userData, fechaNacimiento: text})}
          />
        </View>

        {/* Sección Domicilio */}
        <Text style={styles.subsectionTitle}>Domicilio</Text>

        {/* Barrio */}
        <View style={styles.inputGroup}>
          <FontAwesome name="map-marker" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Barrio"
            placeholderTextColor="#666"
            value={userData.barrio}
            onChangeText={(text) => setUserData({...userData, barrio: text})}
          />
        </View>

        {/* Calle */}
        <View style={styles.inputGroup}>
          <FontAwesome name="road" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Calle"
            placeholderTextColor="#666"
            value={userData.calle}
            onChangeText={(text) => setUserData({...userData, calle: text})}
          />
        </View>

        {/* Número */}
        <View style={styles.inputGroup}>
          <FontAwesome name="home" size={20} color="#b9770e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Número"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={userData.numero}
            onChangeText={(text) => setUserData({...userData, numero: text})}
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRequest}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de confirmación para guardar */}
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
            <Text style={styles.alertMessage}>¿Estás seguro que quieres guardar los cambios?</Text>
            
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

      {/* Modal de confirmación para volver (Advertencia de cambios no guardados) */}
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
            <Text style={styles.alertMessage}>Tienes cambios sin guardar. ¿Estás seguro que deseas salir?</Text>
            
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
    width: '85%',
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
});

export default EditInformation;
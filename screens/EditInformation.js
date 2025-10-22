import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAlert from '../src/components/CustomAlert';

const EditInformation = ({ navigation }) => {
  const user = auth.currentUser;
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fechaNacimiento: '',
    ciudad: '',
    email: user?.email || '' 
  });

  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

  useEffect(() => {
    loadUserData();
  }, []);

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  const loadUserData = async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const emailFromAuth = user.email || '';
      let nombreInicial = '';
      let apellidoInicial = '';

      if (user.displayName) {
          const names = user.displayName.split(' ');
          nombreInicial = names[0] || '';
          apellidoInicial = names.slice(1).join(' ') || '';
      }
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        setFormData({
          nombre: userData.nombre || nombreInicial,
          apellido: userData.apellido || apellidoInicial,
          telefono: userData.telefono || '',
          fechaNacimiento: userData.fechaNacimiento || '',
          ciudad: userData.ciudad || '',
          email: emailFromAuth
        });
        
        if (userData.fechaNacimiento) {
          const [day, month, year] = userData.fechaNacimiento.split('/');
          setSelectedDate(new Date(year, month - 1, day)); 
        }
      } else {
        setFormData({
          nombre: nombreInicial,
          apellido: apellidoInicial,
          telefono: '',
          fechaNacimiento: '',
          ciudad: '',
          email: emailFromAuth
        });
      }
    } catch (error) {
      console.log('Error cargando datos:', error);
      const emailFromAuth = user.email || '';
      let nombreInicial = '';
      let apellidoInicial = '';

      if (user.displayName) {
        const names = user.displayName.split(' ');
        nombreInicial = names[0] || '';
        apellidoInicial = names.slice(1).join(' ') || '';
      }

      setFormData({
        nombre: nombreInicial,
        apellido: apellidoInicial,
        telefono: '',
        fechaNacimiento: '',
        ciudad: '',
        email: emailFromAuth
      });
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && date) {
        setSelectedDate(date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        setFormData({...formData, fechaNacimiento: `${day}/${month}/${year}`});
      }
    } else {
      if (date) {
        setSelectedDate(date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        setFormData({...formData, fechaNacimiento: `${day}/${month}/${year}`});
      }
    }
  };

  const handleDatePickerConfirm = () => {
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    if (!user) {
      showAlert('', 'No hay usuario logueado');
      return;
    }

    if (!formData.nombre || !formData.apellido) {
      showAlert('', 'Nombre y apellido son obligatorios');
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, 'users', user.uid), {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        ciudad: formData.ciudad,
        email: user.email, 
        updatedAt: new Date(),
      }, { merge: true });

      showAlert('Éxito', 'Datos guardados correctamente');
      setTimeout(() => navigation.goBack(), 1500);
      
    } catch (error) {
      showAlert('', 'No se pudieron guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b9770e" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.formSection}>
        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={18} color="#b9770e" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => setFormData({...formData, nombre: text})}
            placeholder="Tu nombre"
            placeholderTextColor="#666666"
          />
        </View>

        {/* Apellido */}
        <Text style={styles.label}>Apellido</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={18} color="#b9770e" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.apellido}
            onChangeText={(text) => setFormData({...formData, apellido: text})}
            placeholder="Tu apellido"
            placeholderTextColor="#666666"
          />
        </View>

        {/* Teléfono */}
        <Text style={styles.label}>Teléfono</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={18} color="#b9770e" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.telefono}
            onChangeText={(text) => setFormData({...formData, telefono: text})}
            placeholder="Número de teléfono"
            placeholderTextColor="#666666"
            keyboardType="phone-pad"
          />
        </View>

        {/* Fecha de Nacimiento */}
        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <FontAwesome name="calendar" size={18} color="#b9770e" style={styles.inputIcon} />
          <Text style={formData.fechaNacimiento ? styles.inputText : styles.placeholderText}>
            {formData.fechaNacimiento || 'dd/mm/aaaa'}
          </Text>
        </TouchableOpacity>

        {/* Ciudad */}
        <Text style={styles.label}>Ciudad</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="map-marker" size={18} color="#b9770e" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.ciudad}
            onChangeText={(text) => setFormData({...formData, ciudad: text})}
            placeholder="Tu ciudad"
            placeholderTextColor="#666666"
          />
        </View>

        {/* Email - NO EDITABLE */}
        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputContainer, styles.disabledInput]}>
          <FontAwesome name="envelope" size={18} color="#666666" style={styles.inputIcon} />
          <Text style={styles.disabledInputText}>{formData.email}</Text>
        </View>
        <Text style={styles.helperText}>Este campo no se puede modificar</Text>
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity 
        style={[styles.saveButton, loading && styles.disabledButton]} 
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Guardando...' : 'Guardar Datos'}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => Platform.OS === 'ios' && setShowDatePicker(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    locale="es-ES"
                    textColor="#ffffff"
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity 
                      style={styles.datePickerButton}
                      onPress={handleDatePickerConfirm}
                    >
                      <Text style={styles.datePickerButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
  },
  formSection: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#b9770e',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: '#666666',
  },
  disabledInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333333',
  },
  disabledInputText: {
    flex: 1,
    fontSize: 16,
    color: '#666666',
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: '#b9770e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 30,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  disabledButton: {
    backgroundColor: '#666666',
    borderColor: '#666666',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#b9770e',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  datePickerButton: {
    backgroundColor: '#b9770e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditInformation;
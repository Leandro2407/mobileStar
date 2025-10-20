import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator, 
} from 'react-native';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditInformation = ({ navigation }) => {
  const user = auth.currentUser;
  
  // 1. Inicializa el email con el valor de auth
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fechaNacimiento: '',
    ciudad: '',
    email: user?.email || '' 
  });

  const [loading, setLoading] = useState(true); // Empezamos en carga
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Cargar datos del usuario
  useEffect(() => {
    loadUserData();
  }, []);

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

      // Intenta obtener nombre y apellido del displayName de Auth
      if (user.displayName) {
          const names = user.displayName.split(' ');
          nombreInicial = names[0] || '';
          apellidoInicial = names.slice(1).join(' ') || '';
      }
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Prioriza datos de Firestore, usa Auth como fallback si están vacíos
        setFormData({
          nombre: userData.nombre || nombreInicial,
          apellido: userData.apellido || apellidoInicial,
          telefono: userData.telefono || '',
          fechaNacimiento: userData.fechaNacimiento || '',
          ciudad: userData.ciudad || '',
          email: emailFromAuth
        });
        
        // Si hay fecha de nacimiento guardada (formato dd/mm/aaaa), establecerla en el picker
        if (userData.fechaNacimiento) {
          const [day, month, year] = userData.fechaNacimiento.split('/');
          // Meses en JS son 0-indexados (Enero=0)
          setSelectedDate(new Date(year, month - 1, day)); 
        }
      } else {
        // 2. Si no existe en Firestore, usa solo datos de auth.currentUser
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
      // ELIMINADO: Alert.alert('Error de carga', 'No se pudieron obtener los datos de usuario.');
      // En lugar de mostrar alerta, simplemente usamos datos por defecto
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

  // Manejar cambio de fecha
  const onDateChange = (event, date) => {
    // Si la plataforma es Android, el picker se cierra al seleccionar
    if (event.type === 'set') {
        if (date) {
            setSelectedDate(date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            setFormData({...formData, fechaNacimiento: `${day}/${month}/${year}`});
        }
        setShowDatePicker(false);
    } else if (event.type === 'dismissed') {
        setShowDatePicker(false);
    }
    // En iOS, el modal debe cerrarse con el botón 'Aceptar'
  };

  // Guardar datos
  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'No hay usuario logueado');
      return;
    }

    if (!formData.nombre || !formData.apellido) {
      Alert.alert('Error', 'Nombre y apellido son obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Guardar en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        ciudad: formData.ciudad,
        email: user.email, 
        updatedAt: new Date(),
      }, { merge: true });

      Alert.alert('Éxito', 'Datos guardados correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos: ' + error.message);
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
        <Text style={styles.sectionTitle}>Nombre</Text>
        <TextInput
          style={[styles.input, styles.textInput]}
          value={formData.nombre}
          onChangeText={(text) => setFormData({...formData, nombre: text})}
          placeholder="Tu nombre"
          placeholderTextColor="#9ca3af" 
        />

        {/* Apellido */}
        <Text style={styles.sectionTitle}>Apellido</Text>
        <TextInput
          style={[styles.input, styles.textInput]}
          value={formData.apellido}
          onChangeText={(text) => setFormData({...formData, apellido: text})}
          placeholder="Tu apellido"
          placeholderTextColor="#9ca3af"
        />

        {/* Teléfono */}
        <Text style={styles.sectionTitle}>Teléfono</Text>
        <TextInput
          style={[styles.input, styles.textInput]}
          value={formData.telefono}
          onChangeText={(text) => setFormData({...formData, telefono: text})}
          placeholder="Número de teléfono"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
        />

        {/* Fecha de Nacimiento (con ícono y TouchableOpacity para abrir calendario) */}
        <Text style={styles.sectionTitle}>Fecha de Nacimiento</Text>
        <TouchableOpacity 
          style={styles.inputTouchable} // Estilo diferente para el Touchable
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={formData.fechaNacimiento ? styles.inputText : styles.placeholderText}>
            {formData.fechaNacimiento || 'dd/mm/aaaa'}
          </Text>
          <FontAwesome name="calendar" size={20} color="#b9770e" />
        </TouchableOpacity>

        {/* Ciudad */}
        <Text style={styles.sectionTitle}>Ciudad</Text>
        <TextInput
          style={[styles.input, styles.textInput]}
          value={formData.ciudad}
          onChangeText={(text) => setFormData({...formData, ciudad: text})}
          placeholder="Tu ciudad"
          placeholderTextColor="#9ca3af"
        />

        {/* Email - NO EDITABLE */}
        <Text style={styles.sectionTitle}>Email</Text>
        <View style={[styles.inputTouchable, styles.disabledInput]}>
          <Text style={styles.disabledInputText}>{formData.email}</Text>
        </View>
        <Text style={styles.helperText}>Este campo no se puede modificar (tomado del registro inicial)</Text>
      </View>

      <View style={styles.separator} />

      {/* Botón Guardar Datos */}
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
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  locale="es-ES"
                  // iOS muestra botones, Android no
                />
                {/* Botón de Aceptar solo necesario para cerrar el modal en iOS/Web */}
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // --- Contenedores y Carga ---
  container: {
    flex: 1,
    backgroundColor: '#000000', // Fondo modo oscuro
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
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f3f4f6', // Texto en blanco/gris claro
    marginBottom: 8,
    marginTop: 15,
  },
  
  // --- Estilos de Input Base (para TouchableOpacity) ---
  inputTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#4b5563', 
    borderRadius: 12, 
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#374151', 
    minHeight: 50,
  },

  // --- Estilos de Input para TextInput (se extienden del base) ---
  input: {
    paddingVertical: 12, // Mantener el padding
  },
  textInput: {
    color: '#ffffff', // Color del texto escrito
  },

  inputText: {
    fontSize: 16,
    color: '#ffffff', 
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af', // Placeholder gris
    flex: 1,
  },
  
  // --- Estilos de Input Deshabilitado ---
  disabledInput: {
    backgroundColor: '#4b5563', 
    borderColor: '#4b5563',
  },
  disabledInputText: {
    fontSize: 16,
    color: '#d1d5db', 
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af', 
    marginTop: 5,
    fontStyle: 'italic',
  },

  // --- Botón y Separador ---
  separator: {
    height: 1,
    backgroundColor: '#374151', 
    marginHorizontal: 20,
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#b9770e', // Color principal
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#b9770e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#6b7280', 
    shadowColor: 'transparent',
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // --- Estilos del Modal del Calendario ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#1f2937', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePickerButton: {
    backgroundColor: '#b9770e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditInformation;
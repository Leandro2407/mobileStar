import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAlert from '../src/components/CustomAlert';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../src/config/firebaseConfig';

export default function CreateTask({ navigation }) {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [employees, setEmployees] = useState('');
  const [priority, setPriority] = useState('media');
  const [status, setStatus] = useState('iniciada');
  const [description, setDescription] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const db = getFirestore();

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleCreateTask = async () => {
    if (!taskName || !duration || !employees || !description) {
      showAlert('', 'Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        showAlert('', 'Error: Usuario no autenticado.');
        return;
      }

      const newTask = {
        name: taskName,
        duration,
        date: formatDate(date),
        employees: employees.split(',').map(e => e.trim()),
        priority,
        status,
        description,
        createdAt: new Date().toISOString(),
      };

      const tasksCollection = collection(db, `users/${userId}/tasks`);
      await addDoc(tasksCollection, newTask);

      showAlert('', 'Tarea creada exitosamente');
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      showAlert('', 'Hubo un error al crear la tarea. Intente nuevamente.');
    }
  };

  const PriorityButton = ({ value, label, color }) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        priority === value && { backgroundColor: color, borderColor: color }
      ]}
      onPress={() => setPriority(value)}
    >
      <Text style={[
        styles.priorityButtonText,
        priority === value && styles.priorityButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const StatusButton = ({ value, label, color }) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        status === value && { backgroundColor: color, borderColor: color }
      ]}
      onPress={() => setStatus(value)}
    >
      <Text style={[
        styles.statusButtonText,
        status === value && styles.statusButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Tarea</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre de la tarea *</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome name="tasks" size={18} color="#b9770e" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Inspección de propiedad"
                  placeholderTextColor="#666"
                  value={taskName}
                  onChangeText={setTaskName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Duración *</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome name="clock-o" size={18} color="#b9770e" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 2 horas"
                  placeholderTextColor="#666"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha *</Text>
              <TouchableOpacity 
                style={styles.inputWrapper}
                onPress={() => setShowDatePicker(true)}
              >
                <FontAwesome name="calendar" size={18} color="#b9770e" style={styles.inputIcon} />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <FontAwesome name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Empleados involucrados *</Text>
              <Text style={styles.helperText}>Separar por comas</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome name="users" size={18} color="#b9770e" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Juan Pérez, María González"
                  placeholderTextColor="#666"
                  value={employees}
                  onChangeText={setEmployees}
                  multiline
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Prioridad *</Text>
              <View style={styles.priorityContainer}>
                <PriorityButton value="alta" label="Alta" color="#e74c3c" />
                <PriorityButton value="media" label="Media" color="#f39c12" />
                <PriorityButton value="baja" label="Baja" color="#2ecc71" />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado *</Text>
              <View style={styles.statusContainer}>
                <StatusButton value="iniciada" label="Iniciada" color="#3498db" />
                <StatusButton value="en proceso" label="En Proceso" color="#f39c12" />
              </View>
              <View style={styles.statusContainer}>
                <StatusButton value="finalizada" label="Finalizada" color="#2ecc71" />
                <StatusButton value="cancelada" label="Cancelada" color="#95a5a6" />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripción *</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe la tarea en detalle..."
                  placeholderTextColor="#666"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateTask}
            >
              <FontAwesome name="check" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.createButtonText}>Crear Tarea</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 15,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  dateText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    minHeight: 120,
    paddingVertical: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
  },
  priorityButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priorityButtonTextActive: {
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#b9770e',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
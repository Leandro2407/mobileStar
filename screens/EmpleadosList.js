import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../src/config/firebaseConfig";
import EmpleadoItem from "../src/components/EmpleadoItem";
import { FontAwesome } from "@expo/vector-icons";
import CustomAlert from "../src/components/CustomAlert";

export default function EmpleadosList({ navigation }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEmpleados();
    });
    fetchEmpleados();
    return unsubscribe;
  }, [navigation]);

  const fetchEmpleados = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "empleados"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpleados(data);
    } catch (error) {
      console.error("Error obteniendo empleados:", error.code, error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmpleadoPress = (empleado) => {
    navigation.navigate('EmpleadoProfile', { empleado });
  };

  const handleEditPress = (empleado) => {
    navigation.navigate('EditEmpleado', { empleado });
  };

  const handleDeletePress = (empleado) => {
    setSelectedEmpleado(empleado);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmpleado) return;

    try {
      await deleteDoc(doc(db, "empleados", selectedEmpleado.id));
      setDeleteModalVisible(false);
      showAlert('Éxito', 'Empleado eliminado correctamente');
      fetchEmpleados();
    } catch (error) {
      console.error("Error eliminando empleado:", error);
      showAlert('Error', 'No se pudo eliminar el empleado');
    }
  };

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b9770e" />
        <Text style={styles.loadingText}>Cargando empleados...</Text>
      </View>
    );
  }

  if (empleados.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="users" size={80} color="#333" />
        <Text style={styles.emptyText}>No hay empleados registrados</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEmpleado')}
        >
          <FontAwesome name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Agregar Empleado</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={empleados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.empleadoItemContainer}>
            <TouchableOpacity 
              style={styles.empleadoContent}
              onPress={() => handleEmpleadoPress(item)}
            >
              <EmpleadoItem 
                nombre={item.nombre}
                apellido={item.apellido}
                imagen={item.imagen}
                activo={item.activo}
              />
            </TouchableOpacity>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditPress(item)}
              >
                <FontAwesome name="edit" size={18} color="#3498db" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeletePress(item)}
              >
                <FontAwesome name="trash" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddEmpleado')}
      >
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal de confirmación de eliminación */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <FontAwesome name="exclamation-triangle" size={50} color="#e74c3c" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Eliminar Empleado</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro que deseas eliminar a {selectedEmpleado?.nombre} {selectedEmpleado?.apellido}?
            </Text>
            <Text style={styles.modalWarning}>Esta acción no se puede deshacer.</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>Eliminar</Text>
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
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#999', 
    fontSize: 16 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212',
    padding: 40,
  },
  emptyText: { 
    color: '#999', 
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b9770e',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    gap: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContent: { 
    padding: 10 
  },
  empleadoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
  },
  empleadoContent: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  editButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderColor: '#e74c3c',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#b9770e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalWarning: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
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
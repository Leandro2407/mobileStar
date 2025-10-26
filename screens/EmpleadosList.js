import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/config/firebaseConfig";
import EmpleadoItem from "../src/components/EmpleadoItem"; // ruta corregida según tu estructura

export default function EmpleadosList({ navigation }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchEmpleados();
  }, []);

  const handleEmpleadoPress = (empleado) => {
    navigation.navigate('EmpleadoProfile', { empleado });
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
        <Text style={styles.emptyText}>No hay empleados registrados</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={empleados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEmpleadoPress(item)}>
            <EmpleadoItem 
              nombre={item.nombre}
              apellido={item.apellido}
              imagen={item.imagen}
              activo={item.activo}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { marginTop: 10, color: '#999', fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  emptyText: { color: '#999', fontSize: 16 },
  listContent: { padding: 10 },
});
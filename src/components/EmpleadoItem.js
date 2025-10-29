import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

export default function EmpleadoItem({ nombre, apellido, imagen, activo, telefono }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome name="user" size={30} color="#b9770e" />
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>
          {nombre} {apellido}
        </Text>
        
        {/* Teléfono debajo del nombre */}
        {telefono ? (
          <View style={styles.telefonoContainer}>
            <FontAwesome name="phone" size={12} color="#999" />
            <Text style={styles.telefono}>{telefono}</Text>
          </View>
        ) : (
          <Text style={styles.telefonoVacio}>Sin teléfono</Text>
        )}
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: activo ? "#27ae60" : "#e74c3c" }]} />
          <Text style={[styles.estado, { color: activo ? "#27ae60" : "#e74c3c" }]}>
            {activo ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>
      
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  imageContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#b9770e',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
    marginBottom: 4,
  },
  telefonoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  telefono: {
    fontSize: 13,
    color: '#999',
    marginLeft: 6,
  },
  telefonoVacio: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  estado: {
    fontSize: 14,
    fontWeight: '500',
  },
});
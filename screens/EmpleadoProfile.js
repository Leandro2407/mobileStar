import React from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function EmpleadoProfile({ route }) {
    const { empleado } = route.params;

    const getInitials = () => {
      if (!empleado?.nombre) return 'EM';
      const firstName = empleado.nombre[0] || 'E';
      const lastName = empleado.apellido ? empleado.apellido[0] : 'M';
      return (firstName + lastName).toUpperCase();
    };

    // Construir domicilio completo para mostrar
    const getDomicilioCompleto = () => {
      const partes = [];
      if (empleado.calle) partes.push(empleado.calle);
      if (empleado.numeroDomicilio) partes.push(empleado.numeroDomicilio);
      if (empleado.barrio) partes.push(`Barrio ${empleado.barrio}`);
      return partes.length > 0 ? partes.join(', ') : 'No registrado';
    };

    return (
      <ImageBackground 
        source={require('../assets/fondo-perfil.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header con foto de perfil */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              {empleado.imagen ? (
                <Image source={{ uri: empleado.imagen }} style={styles.profileImage} />
              ) : (
                <View style={styles.initialsCircle}>
                  <Text style={styles.initials}>{getInitials()}</Text>
                </View>
              )}
            </View>

            <Text style={styles.name}>
              {empleado.nombre} {empleado.apellido}
            </Text>
            
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { 
                backgroundColor: empleado.activo ? "#27ae60" : "#e74c3c" 
              }]} />
              <Text style={[styles.statusText, { 
                color: empleado.activo ? "#27ae60" : "#e74c3c" 
              }]}>
                {empleado.activo ? "Activo" : "Inactivo"}
              </Text>
            </View>
          </View>

          {/* Información del empleado */}
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="id-card" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>DNI</Text>
                </View>
                <Text style={styles.infoValue}>
                  {empleado.dni || 'No registrado'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="envelope" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Email</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {empleado.email || 'No registrado'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="phone" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Teléfono</Text>
                </View>
                <Text style={styles.infoValue}>{empleado.telefono || 'No registrado'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="briefcase" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Puesto</Text>
                </View>
                <Text style={styles.infoValue}>{empleado.puesto || 'No asignado'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="calendar" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Fecha de Ingreso</Text>
                </View>
                <Text style={styles.infoValue}>
                  {empleado.fechaIngreso || 'No registrada'}
                </Text>
              </View>
            </View>

            {/* Sección de Domicilio */}
            <Text style={styles.sectionTitle}>Domicilio</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="map-marker" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Barrio</Text>
                </View>
                <Text style={styles.infoValue}>{empleado.barrio || 'No registrado'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="road" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Calle</Text>
                </View>
                <Text style={styles.infoValue}>{empleado.calle || 'No registrada'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="home" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Número</Text>
                </View>
                <Text style={styles.infoValue}>{empleado.numeroDomicilio || 'No registrado'}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <FontAwesome name="map" size={20} color="#b9770e" />
                  <Text style={styles.infoLabel}>Domicilio Completo</Text>
                </View>
                <Text style={styles.infoValue}>{getDomicilioCompleto()}</Text>
              </View>
            </View>

            {/* Notas adicionales */}
            {empleado.notas && (
              <>
                <Text style={styles.sectionTitle}>Notas</Text>
                <View style={styles.notesCard}>
                  <Text style={styles.notesText}>{empleado.notas}</Text>
                </View>
              </>
            )}
          </View>
          
        </ScrollView>
      </ImageBackground>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profileContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#b9770e',
  },
  initialsCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#b9770e',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#b9770e',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  infoCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#b9770e',
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#cccccc',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginHorizontal: 20,
  },
  notesCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#b9770e',
    padding: 20,
    marginBottom: 20,
  },
  notesText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 22,
  },
});
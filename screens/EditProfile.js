import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons'; 

const EditProfile = ({ navigation }) => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    // Carga inicial al montar el componente
    loadUserData();
    
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData({}); // Datos básicos si no existe documento de Firestore
        }
      } else {
        setUserData({}); // Datos básicos si no hay usuario logueado
      }
    } catch (error) {
      console.log('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Datos ---
  
  // Extrae el nombre completo de Auth o Firestore
  const getFullName = () => {
    // 1. Si existe en Firestore, usa nombre y apellido guardados
    if (userData?.nombre && userData?.apellido) {
      return `${userData.nombre} ${userData.apellido}`;
    }
    // 2. Si no, usa el displayName de Auth
    return user?.displayName || 'Usuario no registrado';
  };
  
  // Extrae nombre y apellido por separado para el placeholder de las iniciales
  const getNamesFromData = () => {
      if (userData?.nombre && userData?.apellido) {
        return [userData.nombre, userData.apellido];
      }
      if (user?.displayName) {
        const names = user.displayName.split(' ');
        const nombre = names[0] || '';
        const apellido = names.length > 1 ? names.slice(1).join(' ') : '';
        return [nombre, apellido];
      }
      return ['', ''];
  };
  
  // Obtener iniciales del nombre completo para el avatar
  const getInitials = () => {
    const [nombre, apellido] = getNamesFromData();
    const initials = [];
    if (nombre) initials.push(nombre[0]);
    if (apellido) initials.push(apellido[0]);
    
    return initials.join('').toUpperCase() || 'US';
  };

  const displayName = getFullName();
  const email = user?.email || 'email@desconocido.com';
  const telefono = userData?.telefono || 'No especificado';
  const fechaNacimiento = userData?.fechaNacimiento || 'No especificada';
  const ciudad = userData?.ciudad || 'No especificada';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b9770e" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {/* Header - Diseño del fondo con la ciudad (simulado) y el avatar */}
      <View style={styles.header}>
        {/* Simulación del fondo con imagen de ciudad, usando un color sólido oscuro */}
        <View style={styles.backgroundImagePlaceholder} />
        
        <View style={styles.profileContainer}>
          {/* Avatar de Iniciales */}
          <View style={styles.avatar}>
            <Text style={styles.initials}>{getInitials()}</Text>
          </View>
          
          <View style={styles.nameAndEmailContainer}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />
      
      {/* Sección de INFORMACIÓN PERSONAL */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>

        {/* NOMBRE COMPLETO */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>NOMBRE COMPLETO</Text>
          <Text style={styles.infoValue}>{displayName}</Text>
        </View>

        {/* EMAIL */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>EMAIL</Text>
          <Text style={styles.infoValue}>{email}</Text>
        </View>

        {/* TELÉFONO */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>TELÉFONO</Text>
          <Text style={styles.infoValue}>{telefono}</Text>
        </View>

        {/* FECHA DE NACIMIENTO */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>FECHA DE NACIMIENTO</Text>
          <Text style={styles.infoValue}>{fechaNacimiento}</Text>
        </View>

        {/* CIUDAD */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>CIUDAD</Text>
          <Text style={styles.infoValue}>{ciudad}</Text>
        </View>
        
        {/* Espacio para que el botón de Guardar no quede pegado */}
        <View style={{height: 50}} /> 
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // --- Colores y Layout Principal ---
  container: {
    flex: 1,
    backgroundColor: '#000000', // Fondo modo oscuro
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
  },
  
  // --- Estilos del Header (similar a la imagen) ---
  header: {
    paddingBottom: 20,
    backgroundColor: '#000000', // Fondo oscuro
    overflow: 'hidden',
  },
  backgroundImagePlaceholder: {
    // Simula la franja de fondo verde de la imagen, pero en naranja oscuro
    height: 150, 
    backgroundColor: '#b4753aff', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 80, // Baja el perfil debajo del fondo simulado
    backgroundColor: 'transparent',
  },
  
  // --- Avatar (Círculo de Iniciales) ---
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000000', // Color principal naranja/dorado
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 3, // Borde para parecer más una "foto"
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  initials: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  // --- Nombre y Email ---
  nameAndEmailContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff', // Blanco para el nombre
  },
  email: {
    fontSize: 14,
    color: '#d1d5db', // Gris claro para el email
  },
  
  // --- Separador ---
  separator: {
    height: 1,
    backgroundColor: '#000000', // Separador sutil oscuro
    marginHorizontal: 20,
    marginVertical: 10,
  },
  
  // --- Sección de Información Personal ---
  infoSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#b9770e', // Color principal para el título de sección
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  infoItem: {
    marginBottom: 25,
    paddingBottom: 5,
    borderBottomWidth: 1, // Separador sutil para cada item
    borderBottomColor: '#000000',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af', // Gris para la etiqueta
    fontWeight: '600',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff', // Blanco para el valor
    fontWeight: '500',
  },
});

export default EditProfile;
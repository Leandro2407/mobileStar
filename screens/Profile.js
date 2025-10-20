import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../src/config/firebaseConfig'; 
import { Ionicons } from '@expo/vector-icons';
const HouseBackground = require('../assets/Fondo.jpg');
const Profile = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Escucha los cambios de autenticación para asegurar que el usuario esté actualizado
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe; // Limpia el listener al desmontar
  }, []);

  const user = currentUser;

  // Obtener la inicial del nombre del usuario logueado
  const getInitials = () => {
    if (!user?.displayName) return 'US';
    const names = user.displayName.split(' ');
    const firstName = names[0];
    return firstName[0].toUpperCase();
  };

  // Función para seleccionar imagen de la galería
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar la foto de perfil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        // Aquí podrías subir la imagen a Firebase Storage
        Alert.alert('Éxito', 'Foto de perfil actualizada');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Definición del array menuItems (corregido: agregado const menuItems = [ y ];)
  const menuItems = [
    {
      label: 'Ver perfil',
      // Aquí es donde USAS el componente Ionicons
      icon: <Ionicons name="person-outline" size={24} color="#da7f2aff" />, 
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      label: 'Editar información',
      // Aquí también lo USAS
      icon: <Ionicons name="create-outline" size={24} color="#da7f2aff" />, 
      onPress: () => navigation.navigate('EditInformation'),
    },
    {
      label: 'Cambiar contraseña',
      // Y aquí. Una vez que agregues esto, el warning desaparecerá.
      icon: <Ionicons name="key-outline" size={24} color="#da7f2aff" />, 
      onPress: () => navigation.navigate('ChangePassword'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header con imagen de casa local y overlay */}
        <ImageBackground
          // 2. USO DE LA IMAGEN IMPORTADA
          source={HouseBackground} // Usamos la variable de importación local
          style={styles.headerBackground}
        >
          {/* Overlay oscuro para el efecto de modo oscuro y visibilidad del texto */}
          <View style={styles.darkOverlay} />
          
          {/* Contenido del perfil (Avatar, Nombre, Email) */}
          <View style={styles.profileContent}>
            
            {/* Contenedor del perfil y botón de cámara */}
            <View style={styles.profileCameraContainer}>
              {/* Círculo de perfil o Imagen (más grande) */}
              <TouchableOpacity style={styles.profileTouchable} onPress={pickImage}>
                {profileImage ? (
                  // Muestra la imagen seleccionada si existe
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  // Muestra las iniciales si no hay imagen de perfil
                  <View style={styles.initialsCircle}>
                    <Text style={styles.initials}>{getInitials()}</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Botón de cámara al lado del icono */}
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Nombre del Usuario - Centrado */}
            <Text style={styles.name}>{user?.displayName || 'Usuario'}</Text>
            {/* Email del Usuario - Centrado */}
            <Text style={styles.email}>{user?.email || 'usuario@email.com'}</Text>
          </View>
        </ImageBackground>

        {/* Menú de opciones (Estilo tarjeta) */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuLeft}>
                  {/* Icono (simulado con Emoji) */}
                  <View style={styles.menuIconBox}>
                    <Text style={styles.menuIconText}>{item.icon}</Text>
                  </View>
                  {/* Texto de la opción */}
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
                {/* Flecha (Chevron) como en el diseño de referencia */}
                <Text style={styles.chevron}>&gt;</Text> 
              </TouchableOpacity>
              {/* Separador, omitir en el último elemento */}
              {index < menuItems.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Fondo oscuro general para modo oscuro
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // --- Header con Background Image y Overlay ---
  headerBackground: {
    width: '100%',
    height: 300, 
    justifyContent: 'flex-end',
    // La tarjeta de menú se superpondrá a este espacio
    marginBottom: -50, 
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Overlay oscuro con transparencia para mantener el modo oscuro sobre la imagen
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  
  // --- Contenedor del perfil y cámara ---
  profileCameraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  
  // --- Círculo de Perfil / Avatar (más grande) ---
  profileTouchable: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  initialsCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // --- Círculo de Perfil / Avatar ---
profileCircleContainer: {
  // ... (otros estilos)
  position: 'relative', // IMPORTANTE: Necesitas position: 'relative' aquí
  // ... (otros estilos)
  overflow: 'hidden',
},
// --- Botón de cámara (CORREGIDO para la esquina inferior derecha) ---
cameraButton: {
  position: 'absolute', // Usar posición absoluta
  bottom: 0,           // Pegado al borde inferior
  right: 0,            // Pegado al borde derecho
  backgroundColor: '#da7f2a', // Color del botón
  borderRadius: 15,          // Hacerlo más pequeño y circular (ajustado a 15)
  width: 30,                 // Ancho más pequeño
  height: 30,                // Altura más pequeña
  justifyContent: 'center',
  alignItems: 'center',
  // Elimina marginLeft y marginTop que lo movían fuera
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},
  // --- Texto de Usuario (Centrado) ---
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', 
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
  },
  email: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    width: '100%',
  },
  tagline: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 5,
    width: '100%',
  },

  // --- Sección de Menú (Estilo Tarjeta Flotante) ---
  menuSection: {
    backgroundColor: '#000000',
    marginHorizontal: 16,
    marginTop: 30, 
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingVertical: 11, 
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#575757ff',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 20,
  },
});
export default Profile;
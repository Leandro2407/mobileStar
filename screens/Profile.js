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

  // Obtener iniciales del nombre del usuario logueado
  const getInitials = () => {
    if (!user?.displayName) return 'US';
    const names = user.displayName.split(' ');
    if (names.length >= 2) {
      // Usamos la primera letra del primer nombre y la del último nombre
      const lastName = names[names.length - 1]; 
      return `${names[0][0]}${lastName[0]}`.toUpperCase();
    }
    return user.displayName.substring(0, 2).toUpperCase();
  };

  // Función para seleccionar imagen de la galería (Se mantiene la lógica)
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
        Alert.alert('Éxito', 'Foto de perfil actualizada');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Opciones de menú con sus iconos (usando Emojis como alternativa)
  const menuItems = [
    {
      label: 'Ver perfil',
      icon: '👁️', 
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      label: 'Editar información',
      icon: '✏️',
      onPress: () => navigation.navigate('EditInformation'),
    },
    {
      label: 'Cambiar contraseña',
      icon: '🔐',
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
            
            {/* Círculo de perfil o Imagen (con lógica de iniciales) */}
            <TouchableOpacity style={styles.profileCircleContainer} onPress={pickImage}>
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

            {/* Nombre del Usuario (Tal cual como estaba en tu código) */}
            <Text style={styles.name}>{user?.displayName || 'Usuario'}</Text>
            {/* Email del Usuario (Tal cual como estaba en tu código) */}
            <Text style={styles.email}>{user?.email || 'usuario@email.com'}</Text>
            <Text style={styles.tagline}>Perfil de usuario para la gestión inmobiliaria.</Text>
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
    backgroundColor: '#0f172a', // Fondo oscuro general para modo oscuro
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  
  // --- Círculo de Perfil / Avatar ---
  profileCircleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#94a3b8', // Borde gris claro para destacar
    overflow: 'hidden',
  },
  initialsCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#b9770e', // Color original de tu código (Dorado/Naranja)
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initials: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // --- Texto de Usuario (Blanco sobre fondo oscuro) ---
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', 
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#cbd5e1', // Gris claro
    textAlign: 'center',
  },
  tagline: {
    fontSize: 12,
    color: '#94a3b8', 
    marginTop: 5,
    fontStyle: 'italic',
  },

  // --- Sección de Menú (Estilo Tarjeta Flotante) ---
  menuSection: {
    backgroundColor: '#ffffff', // Fondo blanco de la tarjeta
    marginHorizontal: 16,
    marginTop: 0, 
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingVertical: 10, 
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
    backgroundColor: '#f3f4f6', // Fondo suave para el icono
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIconText: {
    fontSize: 20, // Emoji más grande
  },
  menuText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af', // Gris para la flecha
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6', // Separador sutil
    marginHorizontal: 20,
  },
});

export default Profile;

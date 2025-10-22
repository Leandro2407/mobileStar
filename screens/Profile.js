import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import CustomAlert from '../src/components/CustomAlert';

const Profile = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        loadProfileImage(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Cargar imagen de perfil desde Firestore
  const loadProfileImage = async (uid) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists() && userDoc.data().profileImage) {
        setProfileImage(userDoc.data().profileImage);
      }
    } catch (error) {
      console.log('Error cargando imagen:', error);
    } finally {
      setLoading(false);
    }
  };

  const user = currentUser;

  const getInitials = () => {
    if (!user?.displayName) return 'US';
    const names = user.displayName.split(' ');
    const firstName = names[0];
    return firstName[0].toUpperCase();
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert('Permiso requerido', 'Se necesita acceso a la galería para cambiar la foto de perfil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        
        // Guardar en Firestore
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            profileImage: imageUri,
            updatedAt: new Date(),
          }, { merge: true });
          
          showAlert('Éxito', 'Foto de perfil actualizada correctamente');
        }
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      showAlert('', 'No se pudo seleccionar la imagen');
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
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header con foto de perfil */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <TouchableOpacity style={styles.profileTouchable} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.initialsCircle}>
                  <Text style={styles.initials}>{getInitials()}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <FontAwesome name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{user?.displayName || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email || 'usuario@email.com'}</Text>
        </View>

        {/* Opciones de menú */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuOption}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <FontAwesome name="user" size={22} color="#b9770e" />
              </View>
              <Text style={styles.menuText}>Ver perfil</Text>
            </View>
            <FontAwesome name="chevron-right" size={20} color="#b9770e" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuOption}
            onPress={() => navigation.navigate('EditInformation')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <FontAwesome name="edit" size={22} color="#b9770e" />
              </View>
              <Text style={styles.menuText}>Editar información</Text>
            </View>
            <FontAwesome name="chevron-right" size={20} color="#b9770e" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuOption}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <FontAwesome name="lock" size={22} color="#b9770e" />
              </View>
              <Text style={styles.menuText}>Cambiar contraseña</Text>
            </View>
            <FontAwesome name="chevron-right" size={20} color="#b9770e" />
          </TouchableOpacity>
        </View>
        
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
    </View>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profileContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileTouchable: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#b9770e',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  initialsCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#b9770e',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#b9770e',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  menuContainer: {
    marginHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#b9770e',
    overflow: 'hidden',
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(185, 119, 14, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginHorizontal: 20,
  },
});

export default Profile;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import CustomAlert from './CustomAlert';
import * as Font from 'expo-font';

const GTH_LOGO = require('../../assets/logo.png');

export default function NavBar({ navigation, currentScreen = 'Home' }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
  const [activeScreen, setActiveScreen] = useState(currentScreen);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Pacifico': require('../../assets/fonts/Pacifico-Regular.ttf'),
        'PTSerif-Regular': require('../../assets/fonts/PTSerif-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    loadProfileImage();
    setActiveScreen(currentScreen);
  }, [currentScreen]);

  const loadProfileImage = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().profileImage) {
          setProfileImage(userDoc.data().profileImage);
        }
      } catch (error) {
        console.log('Error cargando imagen:', error);
      }
    }
  };

  const getInitials = () => {
    const user = auth.currentUser;
    if (!user?.displayName) return 'US';
    const names = user.displayName.split(' ');
    return names[0][0].toUpperCase();
  };

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  const handleLogOutConfirm = async () => {
    try {
      await signOut(auth);
      setLogoutAlertVisible(false);
      showAlert('Éxito', 'Sesión cerrada correctamente');
      setTimeout(() => {
        setAlertVisible(false);
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }, 1500);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLogOutRequest = () => {
    setMenuVisible(false);
    setLogoutAlertVisible(true);
  };

  const navigateTo = (screen) => {
    setActiveScreen(screen);
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setMenuVisible(true)}
        >
          <FontAwesome name="bars" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.gthText}>GTH</Text>
          <Text style={styles.appText}> App</Text>
        </View>

        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => navigateTo('Profile')}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitials}>{getInitials()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Menú lateral */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.sideMenu}>
            <View style={styles.menuHeader}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.menuLogo} />
              ) : (
                <Image source={GTH_LOGO} style={styles.menuLogo} />
              )}
              <Text style={styles.menuTitle}>GTH Negocios</Text>
              <Text style={styles.menuSubtitle}>Inmobiliarios</Text>
              <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  activeScreen === 'Home' && styles.menuItemSelected
                ]}
                onPress={() => navigateTo('Home')}
              >
                <FontAwesome 
                  name="home" 
                  size={20} 
                  color={activeScreen === 'Home' ? '#FFFFFF' : '#b9770e'} 
                />
                <Text style={[
                  styles.menuItemText,
                  activeScreen === 'Home' && styles.menuItemTextSelected
                ]}>
                  Inicio
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  activeScreen === 'Profile' && styles.menuItemSelected
                ]}
                onPress={() => navigateTo('Profile')}
              >
                <FontAwesome 
                  name="user-circle" 
                  size={20} 
                  color={activeScreen === 'Profile' ? '#FFFFFF' : '#b9770e'} 
                />
                <Text style={[
                  styles.menuItemText,
                  activeScreen === 'Profile' && styles.menuItemTextSelected
                ]}>
                  Perfil
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  activeScreen === 'Ayuda' && styles.menuItemSelected
                ]}
                onPress={() => navigateTo('Ayuda')}
              >
                <FontAwesome 
                  name="question-circle" 
                  size={20} 
                  color={activeScreen === 'Ayuda' ? '#FFFFFF' : '#b9770e'} 
                />
                <Text style={[
                  styles.menuItemText,
                  activeScreen === 'Ayuda' && styles.menuItemTextSelected
                ]}>
                  Ayuda
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  activeScreen === 'AcercaDe' && styles.menuItemSelected
                ]}
                onPress={() => navigateTo('AcercaDe')}
              >
                <FontAwesome 
                  name="info-circle" 
                  size={20} 
                  color={activeScreen === 'AcercaDe' ? '#FFFFFF' : '#b9770e'} 
                />
                <Text style={[
                  styles.menuItemText,
                  activeScreen === 'AcercaDe' && styles.menuItemTextSelected
                ]}>
                  Acerca de
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.menuItem,
                  activeScreen === 'Configuracion' && styles.menuItemSelected
                ]}
                onPress={() => navigateTo('Configuracion')}
              >
                <FontAwesome 
                  name="cog" 
                  size={20} 
                  color={activeScreen === 'Configuracion' ? '#FFFFFF' : '#b9770e'} 
                />
                <Text style={[
                  styles.menuItemText,
                  activeScreen === 'Configuracion' && styles.menuItemTextSelected
                ]}>
                  Configuración
                </Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogOutRequest}
              >
                <FontAwesome name="sign-out" size={20} color="#e74c3c" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Alerta de confirmación de cierre de sesión */}
      <Modal
        visible={logoutAlertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutAlertVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <FontAwesome name="exclamation-circle" size={50} color="#f39c12" style={styles.alertIcon} />
            <Text style={styles.alertTitle}>Cerrar sesión</Text>
            <Text style={styles.alertMessage}>¿Está seguro que desea cerrar sesión?</Text>
            
            <View style={styles.alertButtons}>
              <TouchableOpacity 
                style={[styles.alertButton, styles.cancelButton]}
                onPress={() => setLogoutAlertVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.alertButton, styles.confirmButton]}
                onPress={handleLogOutConfirm}
              >
                <Text style={styles.confirmButtonText}>Sí, cerrar</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gthText: {
    fontFamily: 'PTSerif-Regular',
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  appText: {
    fontFamily: 'Pacifico',
    fontSize: 18,
    color: '#b9770e',
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#b9770e',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#b9770e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-start',
  },
  sideMenu: {
    width: '75%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#1a1a1a',
    paddingTop: 40,
  },
  menuHeader: {
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuLogo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#b9770e',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#b9770e',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemSelected: {
    backgroundColor: '#b9770e',
    borderLeftWidth: 4,
    borderLeftColor: '#FFFFFF',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
  },
  menuItemTextSelected: {
    fontWeight: 'bold',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
  },
  logoutItem: {
    marginTop: 'auto',
    marginBottom: 30,
  },
  logoutText: {
    color: '#e74c3c',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  alertIcon: {
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 25,
  },
  alertButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  alertButton: {
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
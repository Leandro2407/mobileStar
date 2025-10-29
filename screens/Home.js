import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import CustomAlert from '../src/components/CustomAlert';
import * as Font from 'expo-font';

const GTH_LOGO = require('../assets/logo.png');
const BACKGROUND_IMAGE = require('../assets/home.jpg');

export default function Home({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
        'PTSerif-Regular': require('../assets/fonts/PTSerif-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    loadProfileImage();
    // Actualizar la imagen cuando el usuario regrese a esta pantalla
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileImage();
      setCurrentScreen('Home');
    });
    return unsubscribe;
  }, [navigation]);

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
    setLoading(false);
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

  const getInitials = () => {
    const user = auth.currentUser;
    if (!user?.displayName) return 'US';
    const names = user.displayName.split(' ');
    return names[0][0].toUpperCase();
  };

  const DashboardCard = ({ icon, title, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.dashboardCard, { borderColor: color }]} 
      onPress={onPress}
    >
      <View style={[styles.cardIconContainer, { backgroundColor: color + '30' }]}>
        <FontAwesome name={icon} size={40} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <FontAwesome name="chevron-right" size={24} color={color} />
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} imageStyle={{ opacity: 0.3 }}>
        {/* Navbar */}
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
            onPress={() => navigation.navigate('Profile')}
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

        {/* Contenido principal */}
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.welcomeSubtext}>¿Qué deseas hacer hoy?</Text>
          </View>

          <View style={styles.cardsContainer}>
            <DashboardCard 
              icon="users"
              title="Empleados"
              color="#3498db"
              onPress={() => navigation.navigate('Empleados')} 
/>
            <DashboardCard 
              icon="tasks"
              title="Tareas"
              color="#b9770e"
              onPress={() => navigation.navigate('CreateTask')}
            />
          </View>
        </ScrollView>

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
                    currentScreen === 'Home' && styles.menuItemSelected
                  ]}
                  onPress={() => {
                    setCurrentScreen('Home');
                    setMenuVisible(false);
                  }}
                >
                  <FontAwesome 
                    name="home" 
                    size={20} 
                    color={currentScreen === 'Home' ? '#FFFFFF' : '#b9770e'} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    currentScreen === 'Home' && styles.menuItemTextSelected
                  ]}>
                    Inicio
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.menuItem,
                    currentScreen === 'Profile' && styles.menuItemSelected
                  ]}
                  onPress={() => {
                    setCurrentScreen('Profile');
                    setMenuVisible(false);
                    navigation.navigate('Profile');
                  }}
                >
                  <FontAwesome 
                    name="user-circle" 
                    size={20} 
                    color={currentScreen === 'Profile' ? '#FFFFFF' : '#b9770e'} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    currentScreen === 'Profile' && styles.menuItemTextSelected
                  ]}>
                    Perfil
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.menuItem,
                    currentScreen === 'Ayuda' && styles.menuItemSelected
                  ]}
                  onPress={() => {
                    setCurrentScreen('Ayuda');
                    setMenuVisible(false);
                  }}
                >
                  <FontAwesome 
                    name="question-circle" 
                    size={20} 
                    color={currentScreen === 'Ayuda' ? '#FFFFFF' : '#b9770e'} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    currentScreen === 'Ayuda' && styles.menuItemTextSelected
                  ]}>
                    Ayuda
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.menuItem,
                    currentScreen === 'AcercaDe' && styles.menuItemSelected
                  ]}
                  onPress={() => {
                    setCurrentScreen('AcercaDe');
                    setMenuVisible(false);
                  }}
                >
                  <FontAwesome 
                    name="info-circle" 
                    size={20} 
                    color={currentScreen === 'AcercaDe' ? '#FFFFFF' : '#b9770e'} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    currentScreen === 'AcercaDe' && styles.menuItemTextSelected
                  ]}>
                    Acerca de
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.menuItem,
                    currentScreen === 'Configuracion' && styles.menuItemSelected
                  ]}
                  onPress={() => {
                    setCurrentScreen('Configuracion');
                    setMenuVisible(false);
                  }}
                >
                  <FontAwesome 
                    name="cog" 
                    size={20} 
                    color={currentScreen === 'Configuracion' ? '#FFFFFF' : '#b9770e'} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    currentScreen === 'Configuracion' && styles.menuItemTextSelected
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
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
  mainContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  welcomeSection: {
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardsContainer: {
    paddingBottom: 30,
  },
  dashboardCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.4)',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 2,
  },
  cardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  Modal,
  StatusBar,
  ImageBackground
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

const GTH_LOGO = require('../assets/logo.png');
const BACKGROUND_IMAGE = require('../assets/home.jpg');

export default function Home({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);

  const handleLogOutConfirm = async () => {
    try {
      await signOut(auth);
      setLogoutAlertVisible(false);
      setSuccessAlertVisible(true);
      
      setTimeout(() => {
        setSuccessAlertVisible(false);
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }, 2000);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLogOutRequest = () => {
    setMenuVisible(false);
    setLogoutAlertVisible(true);
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.navbar}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <FontAwesome name="bars" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.navTitle}>GTH App</Text>

          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image source={GTH_LOGO} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

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
              onPress={() => {
                // Navegar a empleados cuando esté implementado
                console.log('Navegar a Empleados');
              }}
            />

            <DashboardCard
              icon="tasks"
              title="Tareas"
              color="#b9770e"
              onPress={() => navigation.navigate('CreateTask')}
            />
          </View>
        </ScrollView>
      </ImageBackground>

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
              <Image source={GTH_LOGO} style={styles.menuLogo} />
              <Text style={styles.menuTitle}>GTH Negocios</Text>
              <Text style={styles.menuSubtitle}>Inmobiliarios</Text>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="home" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Inicio</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('Profile');
                }}
              >
                <FontAwesome name="user-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="question-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Ayuda</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="info-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Acerca de</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="cog" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Configuración</Text>
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

      {/* Alerta de éxito al cerrar sesión */}
      <Modal
        visible={successAlertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessAlertVisible(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <FontAwesome name="check-circle" size={50} color="#2ecc71" style={styles.alertIcon} />
            <Text style={styles.alertTitle}>Sesión cerrada</Text>
            <Text style={styles.alertMessage}>Se ha cerrado sesión correctamente</Text>
          </View>
        </View>
      </Modal>
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
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    textShadowRadius: 3,
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
    width: '70%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: '#1a1a1a',
    paddingTop: 40,
  },
  menuHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#b9770e',
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
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  logoutItem: {
    marginTop: 'auto',
    marginBottom: 20,
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
    backgroundColor: '#1a1a1a',
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
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

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const ModuleCard = ({ icon, title, description, onPress, color }) => (
    <TouchableOpacity style={styles.moduleCard} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <FontAwesome name={icon} size={40} color="#FFFFFF" />
      </View>
      <View style={styles.moduleInfo}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleDescription}>{description}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#b9770e" />
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
            onPress={() => {}}
          >
            <Image source={GTH_LOGO} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.welcomeSubtext}>¿Qué deseas gestionar hoy?</Text>
          </View>

          <View style={styles.modulesContainer}>
            <ModuleCard
              icon="tasks"
              title="Tareas"
              description="Gestiona y crea nuevas tareas"
              color="#3498db"
              onPress={() => navigation.navigate('CreateTask')}
            />

            <ModuleCard
              icon="users"
              title="Empleados"
              description="Administra tu equipo de trabajo"
              color="#2ecc71"
              onPress={() => {}}
            />

            <ModuleCard
              icon="building"
              title="Propiedades"
              description="Gestiona tus propiedades"
              color="#e67e22"
              onPress={() => {}}
            />

            <ModuleCard
              icon="line-chart"
              title="Seguimientos"
              description="Realiza seguimiento de actividades"
              color="#9b59b6"
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </ImageBackground>

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
              <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                }}
              >
                <FontAwesome name="user-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Mi Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                }}
              >
                <FontAwesome name="bell" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Notificaciones</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                }}
              >
                <FontAwesome name="cog" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Configuración</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                }}
              >
                <FontAwesome name="question-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Ayuda</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                }}
              >
                <FontAwesome name="info-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Acerca de</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogOut}
              >
                <FontAwesome name="sign-out" size={20} color="#e74c3c" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  welcomeSection: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 10,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#CCCCCC',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modulesContainer: {
    paddingBottom: 20,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.75)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(185, 119, 14, 0.3)',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#CCCCCC',
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
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
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
});
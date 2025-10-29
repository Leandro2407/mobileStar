import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../src/components/NavBar';

const BACKGROUND_IMAGE = require('../assets/home.jpg');

export default function Ayuda({ navigation }) {
  const handleContactSupport = () => {
    Linking.openURL('mailto:soporte@gthapp.com?subject=Soporte GTH App');
  };

  const HelpCard = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.helpCard} onPress={onPress}>
      <View style={styles.helpIconContainer}>
        <FontAwesome name={icon} size={30} color="#b9770e" />
      </View>
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>{title}</Text>
        <Text style={styles.helpDescription}>{description}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#b9770e" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} currentScreen="Ayuda" />
      
      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.3 }}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <FontAwesome name="question-circle" size={60} color="#b9770e" />
            <Text style={styles.headerTitle}>Centro de Ayuda</Text>
            <Text style={styles.headerSubtitle}>¿En qué podemos ayudarte?</Text>
          </View>

          <View style={styles.cardsContainer}>
            <HelpCard
              icon="users"
              title="Gestión de Empleados"
              description="Aprende a agregar, editar y gestionar empleados"
            />

            <HelpCard
              icon="user-circle"
              title="Mi Perfil"
              description="Administra tu información personal y configuración"
            />

            <HelpCard
              icon="lock"
              title="Seguridad"
              description="Cambiar contraseña y configuración de seguridad"
            />

            <HelpCard
              icon="cog"
              title="Configuración"
              description="Personaliza tu experiencia en la aplicación"
            />
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>¿Necesitas más ayuda?</Text>
            <Text style={styles.contactText}>
              Nuestro equipo de soporte está disponible para ayudarte
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContactSupport}
            >
              <FontAwesome name="envelope" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.contactButtonText}>Contactar Soporte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
  },
  cardsContainer: {
    marginBottom: 30,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  helpIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(185, 119, 14, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  helpDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#b9770e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
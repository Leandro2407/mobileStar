import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../src/components/NavBar';

const BACKGROUND_IMAGE = require('../assets/home.jpg');
const GTH_LOGO = require('../assets/logo.png');

export default function AcercaDe({ navigation }) {
  const InfoCard = ({ icon, title, value }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <FontAwesome name={icon} size={28} color="#b9770e" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} />
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image source={GTH_LOGO} style={styles.logo} />
            <Text style={styles.appName}>GTH App</Text>
            <Text style={styles.appSlogan}>Gestión de Empleados</Text>
          </View>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Sobre la Aplicación</Text>
            <Text style={styles.descriptionText}>
              GTH App es una solución integral diseñada para optimizar la gestión de empleados
              y tareas en empresas inmobiliarias. Nuestra plataforma facilita la organización,
              seguimiento y administración de tu equipo de trabajo.
            </Text>
          </View>
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Características Principales</Text>
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={18} color="#b9770e" />
              <Text style={styles.featureText}>Gestión completa de empleados</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={18} color="#b9770e" />
              <Text style={styles.featureText}>Creación y asignación de tareas</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={18} color="#b9770e" />
              <Text style={styles.featureText}>Perfiles personalizados</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={18} color="#b9770e" />
              <Text style={styles.featureText}>Interfaz intuitiva y moderna</Text>
            </View>
          </View>
          <View style={styles.footerCard}>
            <Text style={styles.footerText}>© 2025 GTH Negocios Inmobiliarios</Text>
            <Text style={styles.footerSubtext}>Todos los derechos reservados</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#b9770e',
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appSlogan: {
    fontSize: 16,
    color: '#b9770e',
    marginTop: 5,
  },
  descriptionCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
    textAlign: 'justify',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(185, 119, 14, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  featuresCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginLeft: 12,
  },
  footerCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999999',
    marginTop: 5,
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Switch,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../src/components/NavBar';
import CustomAlert from '../src/components/CustomAlert';

const BACKGROUND_IMAGE = require('../assets/home.jpg');
const GTH_LOGO = require('../assets/logo.png');

export default function Configuracion({ navigation }) {
  const [notificaciones, setNotificaciones] = useState(true);
  const [sonido, setSonido] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

  const showAlert = (title, message) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
  };

  const SettingOption = ({ icon, title, description, hasSwitch, switchValue, onSwitchChange, onPress, showChevron = true }) => (
    <TouchableOpacity 
      style={styles.settingOption}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <FontAwesome name={icon} size={22} color="#b9770e" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: '#b9770e' }}
          thumbColor={switchValue ? '#FFFFFF' : '#f4f3f4'}
        />
      ) : (
        showChevron && <FontAwesome name="chevron-right" size={20} color="#b9770e" />
      )}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );

  const Divider = () => <View style={styles.divider} />;

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} currentScreen="Configuracion" />
      
      <ImageBackground 
        source={BACKGROUND_IMAGE} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.3 }}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <FontAwesome name="cog" size={60} color="#b9770e" />
            <Text style={styles.headerTitle}>Configuración</Text>
          </View>

          <SettingSection title="Notificaciones">
            <SettingOption
              icon="bell"
              title="Notificaciones Push"
              description="Recibir notificaciones de la app"
              hasSwitch={true}
              switchValue={notificaciones}
              onSwitchChange={setNotificaciones}
            />
            <Divider />
            <SettingOption
              icon="volume-up"
              title="Sonido"
              description="Sonido para notificaciones"
              hasSwitch={true}
              switchValue={sonido}
              onSwitchChange={setSonido}
            />
          </SettingSection>

          <SettingSection title="Apariencia">
            <SettingOption
              icon="moon-o"
              title="Modo Oscuro"
              description="Tema oscuro (activo por defecto)"
              hasSwitch={true}
              switchValue={modoOscuro}
              onSwitchChange={setModoOscuro}
            />
          </SettingSection>

          <SettingSection title="Cuenta">
            <SettingOption
              icon="user"
              title="Editar Perfil"
              description="Cambiar información personal"
              onPress={() => navigation.navigate('EditInformation')}
            />
            <Divider />
            <SettingOption
              icon="lock"
              title="Cambiar Contraseña"
              description="Actualizar tu contraseña"
              onPress={() => navigation.navigate('ChangePassword')}
            />
          </SettingSection>

          <SettingSection title="Privacidad">
            <SettingOption
              icon="shield"
              title="Privacidad"
              description="Configuración de privacidad"
              onPress={() => showAlert('Privacidad', 'Función en desarrollo')}
            />
            <Divider />
            <SettingOption
              icon="file-text"
              title="Términos y Condiciones"
              description="Leer términos de uso"
              onPress={() => showAlert('Términos y Condiciones', 'Función en desarrollo')}
            />
          </SettingSection>

          <SettingSection title="Datos">
            <SettingOption
              icon="database"
              title="Almacenamiento"
              description="Gestionar datos locales"
              onPress={() => showAlert('Almacenamiento', 'Función en desarrollo')}
            />
            <Divider />
            <SettingOption
              icon="trash"
              title="Limpiar Caché"
              description="Eliminar datos temporales"
              onPress={() => showAlert('Caché Limpiado', 'Los datos temporales han sido eliminados')}
            />
          </SettingSection>

          <SettingSection title="Información">
            <SettingOption
              icon="info-circle"
              title="Acerca de"
              description="Información de la aplicación"
              onPress={() => navigation.navigate('AcercaDe')}
            />
            <Divider />
            <SettingOption
              icon="question-circle"
              title="Ayuda"
              description="Centro de ayuda y soporte"
              onPress={() => navigation.navigate('Ayuda')}
            />
          </SettingSection>
        </ScrollView>
      </ImageBackground>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
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
    paddingBottom: 50,
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
  settingSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b9770e',
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#b9770e',
    overflow: 'hidden',
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  settingIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(185, 119, 14, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginHorizontal: 15,
  },
});
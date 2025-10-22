import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons'; 

const EditProfile = ({ navigation }) => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    loadUserData();
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        } else {
          setUserData({});
        }
      } else {
        setUserData({});
      }
    } catch (error) {
      console.log('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFullName = () => {
    if (userData?.nombre && userData?.apellido) {
      return `${userData.nombre} ${userData.apellido}`;
    }
    return user?.displayName || 'Usuario no registrado';
  };
  
  const getNamesFromData = () => {
    if (userData?.nombre && userData?.apellido) {
      return [userData.nombre, userData.apellido];
    }
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      const nombre = names[0] || '';
      const apellido = names.length > 1 ? names.slice(1).join(' ') : '';
      return [nombre, apellido];
    }
    return ['', ''];
  };
  
  const getInitials = () => {
    const [nombre, apellido] = getNamesFromData();
    const initials = [];
    if (nombre) initials.push(nombre[0]);
    if (apellido) initials.push(apellido[0]);
    return initials.join('').toUpperCase() || 'US';
  };

  const displayName = getFullName();
  const email = user?.email || 'email@desconocido.com';
  const telefono = userData?.telefono || 'No especificado';
  const fechaNacimiento = userData?.fechaNacimiento || 'No especificada';
  const ciudad = userData?.ciudad || 'No especificada';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b9770e" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  const InfoCard = ({ icon, label, value }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <View style={styles.iconCircle}>
          <FontAwesome name={icon} size={18} color="#b9770e" />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header con avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.initials}>{getInitials()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Sección de información */}
      <View style={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>
          <View style={styles.sectionLine} />
        </View>

        <InfoCard icon="user" label="Nombre Completo" value={displayName} />
        <InfoCard icon="envelope" label="Correo Electrónico" value={email} />
        <InfoCard icon="phone" label="Teléfono" value={telefono} />
        <InfoCard icon="calendar" label="Fecha de Nacimiento" value={fechaNacimiento} />
        <InfoCard icon="map-marker" label="Ciudad" value={ciudad} />

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingTop: 20,
    backgroundColor: '#000000',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#b9770e',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#b9770e',
  },
  initials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#b9770e',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#999999',
  },
  contentContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b9770e',
    letterSpacing: 1.5,
    marginHorizontal: 15,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(185, 119, 14, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 44,
  },
});

export default EditProfile;
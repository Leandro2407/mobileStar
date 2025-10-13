import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  TextInput,
  ScrollView,
  Modal,
  StatusBar,
  ImageBackground
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth, db } from '../src/config/firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';

const GTH_LOGO = require('../assets/logo.png');
const BACKGROUND_IMAGE = require('../assets/home.jpg');

export default function Home({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = loadTasks();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(task => 
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);

  const loadTasks = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('Usuario no autenticado');
      return;
    }

    const tasksCollection = collection(db, `users/${userId}/tasks`);
    const q = query(tasksCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedTasks = [];
      snapshot.forEach((doc) => {
        loadedTasks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      loadedTasks.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setTasks(loadedTasks);
      setFilteredTasks(loadedTasks);
    }, (error) => {
      console.error('Error al cargar tareas:', error);
    });

    return unsubscribe;
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'alta': return '#e74c3c';
      case 'media': return '#f39c12';
      case 'baja': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'iniciada': return '#3498db';
      case 'en proceso': return '#f39c12';
      case 'finalizada': return '#2ecc71';
      case 'cancelada': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const TaskCard = ({ task }) => (
    <TouchableOpacity style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskName} numberOfLines={1}>{task.name}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
          <Text style={styles.badgeText}>{task.priority.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.taskInfo}>
        <View style={styles.infoRow}>
          <FontAwesome name="clock-o" size={14} color="#b9770e" />
          <Text style={styles.infoText}>{task.duration}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={14} color="#b9770e" />
          <Text style={styles.infoText}>{task.date}</Text>
        </View>
      </View>

      <View style={styles.employeesContainer}>
        <FontAwesome name="users" size={14} color="#b9770e" />
        <Text style={styles.employeesText} numberOfLines={1}>
          {task.employees.join(', ')}
        </Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
        <Text style={styles.statusText}>{task.status.toUpperCase()}</Text>
      </View>
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

        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#b9770e" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar tareas..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Resultados de búsqueda' : 'Tareas pendientes'}
          </Text>
          
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="inbox" size={60} color="#666" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No se encontraron tareas' : 'No hay tareas pendientes'}
              </Text>
              {!searchQuery && (
                <Text style={styles.emptySubtext}>
                  Crea tu primera tarea presionando el botón +
                </Text>
              )}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity 
          style={styles.fabButton}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <FontAwesome name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
            </View>

            <View style={styles.menuItems}>
              <Text style={styles.menuSection}>HERRAMIENTAS</Text>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate('CreateTask');
                }}
              >
                <FontAwesome name="plus-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Crear nueva tarea</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="tasks" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Tareas</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="users" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Empleados</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="building" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Propiedades</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="user-circle" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Cuenta</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setMenuVisible(false)}
              >
                <FontAwesome name="cog" size={20} color="#b9770e" />
                <Text style={styles.menuItemText}>Ajustes</Text>
              </TouchableOpacity>

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    marginHorizontal: 15,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  taskCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(185, 119, 14, 0.2)',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginLeft: 8,
  },
  employeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  employeesText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#b9770e',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  menuSection: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
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
});
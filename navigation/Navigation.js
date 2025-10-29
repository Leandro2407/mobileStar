import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

import InitialScreen from '../screens/InitialScreen';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import EditInformation from '../screens/EditInformation';
import ChangePassword from '../screens/ChangePassword';
import EmpleadosScreen from '../screens/EmpleadosList';
import EmpleadoProfile from '../screens/EmpleadoProfile';
import AddEmpleado from '../screens/AddEmpleado';
import EditEmpleado from '../screens/EditEmpleado';
import Ayuda from '../screens/Ayuda';
import AcercaDe from '../screens/AcercaDe';
import Configuracion from '../screens/Configuracion';

const Stack = createStackNavigator();

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "InitialScreen"}
      >
        <Stack.Screen
          name="InitialScreen"
          component={InitialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ 
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ 
            title: 'Ver Perfil',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff'
            }
          }}
        />
        <Stack.Screen
          name="EditInformation"
          component={EditInformation}
          options={{ 
            title: 'Editar Información',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff'
            }
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ 
            title: 'Cambiar Contraseña',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff',
            }
          }}
        />
        <Stack.Screen
          name="Empleados"
          component={EmpleadosScreen}
          options={{ 
            title: 'Empleados',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff'
            }
          }}
        />
        <Stack.Screen
          name="EmpleadoProfile"
          component={EmpleadoProfile}
          options={{ 
            title: 'Perfil del Empleado',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff'
            }
          }}
        />
        <Stack.Screen
          name="AddEmpleado"
          component={AddEmpleado}
          options={{ 
            title: 'Agregar Empleado',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#b9770e',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff'
            }
          }}
        />
        <Stack.Screen
          name="EditEmpleado"
          component={EditEmpleado}
          options={{ 
            title: 'Editar Empleado',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#b9770e',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff'
            }
          }}
        />
        <Stack.Screen
          name="Ayuda"
          component={Ayuda}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AcercaDe"
          component={AcercaDe}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Configuracion"
          component={Configuracion}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
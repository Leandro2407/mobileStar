import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importa íconos de FontAwesome para los requisitos y ojos

const ChangePassword = () => {
  // Estados para manejar los valores de los campos de contraseña
  const [passwords, setPasswords] = useState({
    currentPassword: '', // Contraseña actual del usuario
    newPassword: '', // Nueva contraseña que quiere establecer
    confirmPassword: '' // Confirmación de la nueva contraseña
  });
  
  // Estados para controlar la visibilidad de las contraseñas (ícono de ojo)
  const [showNewPassword, setShowNewPassword] = useState(false); // Muestra/oculta la nueva contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Muestra/oculta la confirmación de contraseña
  
  // Estados para saber si los campos están enfocados (para mostrar requisitos)
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false); // Si el campo de nueva contraseña está enfocado
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false); // Si el campo de confirmación está enfocado

  // Validaciones para la nueva contraseña (basadas en requisitos de seguridad)
  const isLengthValid = passwords.newPassword.length >= 8; // Debe tener al menos 8 caracteres
  const hasUpperCase = /[A-Z]/.test(passwords.newPassword); // Debe tener al menos una mayúscula
  const hasLowerCase = /[a-z]/.test(passwords.newPassword); // Debe tener al menos una minúscula
  const hasNumber = /\d/.test(passwords.newPassword); // Debe tener al menos un número
  const allRequirementsMet = isLengthValid && hasUpperCase && hasLowerCase && hasNumber; // Todos los requisitos deben cumplirse

  // Validación para confirmar que las contraseñas coinciden
  const passwordsMatch = passwords.newPassword === passwords.confirmPassword && passwords.confirmPassword.length > 0; // Las contraseñas deben ser iguales y no vacías

  // Función que maneja el cambio de contraseña
  const handleChangePassword = () => {
    // Verifica que todos los campos estén llenos
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    // Verifica que la nueva contraseña cumpla con los requisitos
    if (!allRequirementsMet) {
      Alert.alert('Error', 'La nueva contraseña debe cumplir con todos los requisitos de seguridad.');
      return;
    }
    // Verifica que las contraseñas coincidan
    if (!passwordsMatch) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    // Aquí iría la lógica para cambiar contraseña en Firebase (por ahora solo muestra alerta de éxito)
    Alert.alert('Éxito', 'Contraseña cambiada correctamente');
  };

  // Componente para mostrar un requisito de contraseña con ícono de check o times
  const PasswordRequirement = ({ isValid, children }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
      <FontAwesome 
        name={isValid ? "check-circle" : "times-circle"} // Ícono verde si válido, gris si no
        size={14} 
        color={isValid ? '#2ecc71' : '#bebebeff'} 
        style={{ marginRight: 8 }} 
      />
      <Text style={[styles.requirementText, isValid && styles.validRequirement, !isValid && styles.invalidRequirement]}>
        {children} {/* Texto del requisito */}
      </Text>
    </View>
  );

  // Componente para mostrar el requisito de coincidencia de contraseñas
  const ConfirmRequirement = ({ isValid, children }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
      <FontAwesome 
        name={isValid ? "check-circle" : "times-circle"} // Ícono verde si coinciden, gris si no
        size={14} 
        color={isValid ? '#2ecc71' : '#bebebeff'} 
        style={{ marginRight: 8 }} 
      />
      <Text style={[styles.requirementText, isValid && styles.validRequirement, !isValid && styles.invalidRequirement]}>
        {children} {/* Texto del requisito */}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}> {/* Contenedor principal con scroll para pantallas pequeñas */}
      <View style={styles.section}> {/* Sección principal con padding */}
        <Text style={styles.sectionTitle}>Cambiar Contraseña</Text> {/* Título de la pantalla */}
        
        {/* Campo para la contraseña actual */}
        <View style={styles.inputGroup}> {/* Grupo de input con ícono y campo */}
          <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} /> {/* Ícono de candado */}
          <TextInput
            style={styles.input}
            placeholder="Contraseña Actual" // Texto placeholder
            placeholderTextColor="#CCCCCC" // Color del placeholder
            secureTextEntry // Oculta el texto (puntos)
            value={passwords.currentPassword} // Valor del estado
            onChangeText={(text) => setPasswords({...passwords, currentPassword: text})} // Actualiza el estado
          />
        </View>
        
        {/* Campo para la nueva contraseña */}
        <View style={styles.inputGroup}> {/* Grupo de input con ícono, campo y ojo */}
          <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} /> {/* Ícono de candado */}
          <TextInput
            style={styles.input}
            placeholder="Nueva Contraseña" // Texto placeholder
            placeholderTextColor="#CCCCCC" // Color del placeholder
            secureTextEntry={!showNewPassword} // Oculta si no se muestra
            value={passwords.newPassword} // Valor del estado
            onChangeText={(text) => setPasswords({...passwords, newPassword: text})} // Actualiza el estado
            onFocus={() => setIsNewPasswordFocused(true)} // Marca como enfocado para mostrar requisitos
            onBlur={() => setIsNewPasswordFocused(false)} // Desmarca al salir
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNewPassword(!showNewPassword)}> {/* Botón para mostrar/ocultar */}
            <FontAwesome name={showNewPassword ? "eye-slash" : "eye"} size={20} color="#CCCCCC" /> {/* Ícono de ojo */}
          </TouchableOpacity>
        </View>

        {/* Muestra los requisitos de la contraseña solo si el campo está enfocado */}
        {isNewPasswordFocused && (
          <View style={styles.passwordRequirements}> {/* Caja con fondo oscuro para requisitos */}
            <Text style={styles.requirementTitle}>La contraseña debe contener:</Text> {/* Título de los requisitos */}
            <PasswordRequirement isValid={isLengthValid}>8 carácteres como mínimo</PasswordRequirement> {/* Requisito de longitud */}
            <PasswordRequirement isValid={hasUpperCase}>Una mayúscula</PasswordRequirement> {/* Requisito de mayúscula */}
            <PasswordRequirement isValid={hasLowerCase}>Una minúscula</PasswordRequirement> {/* Requisito de minúscula */}
            <PasswordRequirement isValid={hasNumber}>Un número</PasswordRequirement> {/* Requisito de número */}
          </View>
        )}
        
        {/* Campo para confirmar la nueva contraseña */}
        <View style={styles.inputGroup}> {/* Grupo de input con ícono, campo y ojo */}
          <FontAwesome name="lock" size={20} color="#b9770e" style={styles.icon} /> {/* Ícono de candado */}
          <TextInput
            style={styles.input}
            placeholder="Confirmar Nueva Contraseña" // Texto placeholder
            placeholderTextColor="#CCCCCC" // Color del placeholder
            secureTextEntry={!showConfirmPassword} // Oculta si no se muestra
            value={passwords.confirmPassword} // Valor del estado
            onChangeText={(text) => setPasswords({...passwords, confirmPassword: text})} // Actualiza el estado
            onFocus={() => setIsConfirmPasswordFocused(true)} // Marca como enfocado para mostrar validación
            onBlur={() => setIsConfirmPasswordFocused(false)} // Desmarca al salir
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}> {/* Botón para mostrar/ocultar */}
            <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#CCCCCC" /> {/* Ícono de ojo */}
          </TouchableOpacity>
        </View>

        {/* Muestra la validación de coincidencia solo si el campo está enfocado y no coinciden */}
        {isConfirmPasswordFocused && !passwordsMatch && (
          <View style={styles.confirmPasswordRequirements}> {/* Caja con fondo oscuro para validación */}
            <ConfirmRequirement isValid={passwordsMatch}> {/* Requisito de coincidencia */}
              Las contraseñas no coinciden
            </ConfirmRequirement>
          </View>
        )}
        
        {/* Botón para cambiar la contraseña */}
        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}> {/* Botón que ejecuta la función */}
          <Text style={styles.saveButtonText}>Cambiar Contraseña</Text> {/* Texto del botón */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { // Estilo del contenedor principal
    flex: 1,
    backgroundColor: '#000000', // Fondo 
  },
  section: { // Estilo de la sección principal
    padding: 20, // Padding interno
  },
  sectionTitle: { // Estilo del título - CORREGIDO
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20, // Espacio abajo
    color: '#FFFFFF', // Color blanco para el texto
  },
  inputGroup: { // Estilo del grupo de input (ícono + campo + ojo)
    flexDirection: 'row', // Horizontal
    alignItems: 'center', // Centrado vertical
    backgroundColor: '#333333', // Fondo oscuro
    borderRadius: 8, // Bordes redondeados
    paddingHorizontal: 15, // Padding horizontal
    marginBottom: 20, // Espacio abajo
    width: '100%', // Ancho completo
    height: 50, // Altura fija
  },
  icon: { // Estilo del ícono (candado)
    marginRight: 15, // Espacio a la derecha
  },
  input: { // Estilo del campo de texto
    flex: 1, // Ocupa el espacio restante
    color: '#FFFFFF', // Texto blanco
    fontSize: 16, // Tamaño de fuente
  },
  eyeIcon: { // Estilo del botón de ojo
    padding: 5, // Padding interno
  },
  passwordRequirements: { // Estilo de la caja de requisitos de contraseña
    alignSelf: 'flex-start', // Alineado a la izquierda
    width: '100%', // Ancho completo
    marginBottom: 20, // Espacio abajo
    backgroundColor: '#2b2b2b', // Fondo oscuro
    padding: 10, // Padding interno
    borderRadius: 5, // Bordes redondeados
  },
  confirmPasswordRequirements: { // Estilo de la caja de validación de confirmación
    alignSelf: 'flex-start', // Alineado a la izquierda
    width: '100%', // Ancho completo
    marginBottom: 20, // Espacio abajo
    backgroundColor: '#2b2b2b', // Fondo oscuro
    padding: 10, // Padding interno
    borderRadius: 5, // Bordes redondeados
  },
  requirementTitle: { // Estilo del título de los requisitos
    color: '#CCCCCC', // Texto gris claro
    fontWeight: 'bold', // Negrita
    marginBottom: 5, // Espacio abajo
  },
  requirementText: { // Estilo del texto de cada requisito
    color: '#CCCCCC', // Texto gris claro
    fontSize: 14, // Tamaño pequeño
    marginBottom: 3, // Espacio abajo
  },
  validRequirement: { // Estilo cuando el requisito es válido
    color: '#2ecc71', // Verde
    fontWeight: 'bold', // Negrita
  },
  invalidRequirement: { // Estilo cuando el requisito no es válido
    color: '#bebebeff', // Gris
  },
  saveButton: { // Estilo del botón de guardar
    backgroundColor: '#b9770e', // Fondo dorado
    padding: 15, // Padding interno
    borderRadius: 8, // Bordes redondeados
    alignItems: 'center', // Centrado horizontal
    marginTop: 20, // Espacio arriba
  },
  saveButtonText: { // Estilo del texto del botón
    color: '#fff', // Blanco
    fontSize: 16, // Tamaño de fuente
    fontWeight: 'bold', // Negrita
  },
});

export default ChangePassword; // Exporta el componente para usarlo en otras partes de la app
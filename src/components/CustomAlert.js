// Ubicación: src/components/CustomAlert.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CustomAlert = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
          <Text style={styles.modalText}>{message}</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#b9770e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.85,
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  button: {
    borderRadius: 10,
    padding: 14,
    elevation: 2,
    width: '100%',
    backgroundColor: '#b9770e',
    borderWidth: 2,
    borderColor: '#b9770e',
  },
  textStyle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CustomAlert;
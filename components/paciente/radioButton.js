import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';


 export default function RadioButtonCustomizado  ({ label, value, status, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <RadioButton
                value={value}
                status={status}
                onPress={onPress}
                color="#89CC24"
                uncheckedColor="#89CC24"
            />
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10, // Adiciona espaço entre os botões de rádio
        marginBottom: 10,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
    },
});


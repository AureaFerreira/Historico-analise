import React from 'react';
import { Card, Text, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function TelaInicial({ onSelecionarPerfil }) {
    return (
        <View style={styles.container}>
            <Card style={{backgroundColor:'white'}}>
                <Card.Content>
                    <Text style={styles.title}>Defina seu perfil</Text>
                    <View style={styles.buttonContainer}>
                    <Link href='/(tabs)/paciente/home/home'>
                        <Text style={[styles.button, {backgroundColor:'#477BDE'}]}
                           
                        >
                            Paciente
                        </Text>
                        </Link>
                        <Link href='/(tabs)/psicologo/home'>
                        <Text
                           style={[styles.button, {backgroundColor:'#F37187'}]}
                        >
                            Psicólogo
                        </Text>
                        </Link>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        fontFamily:'Poppins-Bold',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily:'Poppins-Bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        marginHorizontal: 5,
        fontFamily:'Poppins-Light',
        color:'white',
        padding:7,
        borderRadius: 5,
        

    },
});

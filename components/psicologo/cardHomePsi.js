import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function CardHomePsi({ paciente }) {
    return (
        <Card style={{ marginTop: 10,}}>
            <Card.Content>
                <View style={styles.card}>
                    <Ionicons style={styles.icon} name="person-outline" size={25} color="black" />
                    <View style={styles.textContainer}>
                        <View style={styles.titulo}>
                            <Text style={styles.nome}>{paciente.nome}</Text>
                            <View style={styles.descricaoBadge}>
                                <Text style={styles.idadeTexto}>{paciente.idade}</Text>
                                <Ionicons
                                    name={paciente.genero === 'M' ? 'male-outline' : 'female-outline'}
                                    size={18}
                                    color="white"
                                />
                            </View>
                        </View>
                        {/* <View style={styles.detailContainer}>
                            <Text style={styles.label}>Próxima sessão:</Text>
                            <Text style={styles.descricao}>{paciente.proxSessao}</Text>
                        </View> */}
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        
        borderRadius: 12,
        marginBottom: 15,
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        elevation: 3,
    },
    icon: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    titulo: {
        flexDirection: 'row', // Alinha nome e badge na mesma linha
        alignItems: 'center',
        gap: 10, // Espaço entre nome e badge
        justifyContent:'space-between'
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Light',
    },
    descricaoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F37187',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 20,
        gap: 2, // Espaçamento entre idade e ícone
    },
    idadeTexto: {
        fontFamily: 'Poppins-Light',
        fontSize: 15,
        color: 'white',
    },
    detailContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    label: {
        fontWeight: 'bold',
        fontFamily: 'Poppins-Light',
        marginRight: 5,
    },
    descricao: {
        fontFamily: 'Poppins-Light',
    },
});

import { React } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppContext } from '@/components/provider';
import { Link } from 'expo-router';
import { Card, Text, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function CardHome({ psicologo, status, index }) {
    const { cores } = useAppContext();
    const { renderStars } = useAppContext();

    return (
        <Card style={{marginTop: 10, backgroundColor:'white'}}>
            <Card.Content >
                <View style={styles.card}>
                    <Ionicons style={styles.imagem} name="person-outline"
                        size={25}
                        color={'black'} />
                    <View style={styles.textContainer}>
                        <View style={styles.titulo}>
                            <Text style={styles.nome}>{psicologo.nome}</Text>
                            <Badge style={status[index] == 'Disponível' ? styles.disponivel : styles.indisponivel}>
                                {status[index]}
                            </Badge>
                        </View>
                        <Text style={styles.especialidade} numberOfLines={3}>{psicologo.especialidade}</Text>
                        <View style={styles.descricao}>
                            <View style={styles.estrelas}>{renderStars(psicologo.quantEstrelas)}</View>
                            <View style={styles.tag}>
                                {psicologo.tags.map((tag, index) => (
                                    <Badge key={index} style={{ backgroundColor: cores[index % cores.length], marginHorizontal: 2, minWidth: 60 }}>
                                        {tag}
                                    </Badge>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </Card.Content>
        </Card>
    )
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Poppins-Light',
        
       
    },
    imagem: {
        marginRight: 15,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
        flex: 1,
        fontFamily: 'Poppins-Light',

    },
    textContainer: {
        flex: 1,
    },
    especialidade: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Poppins-Light',
        flexWrap: 'wrap'
    },
    titulo: {
        flexDirection: 'row',
        alignContent: 'space-between',
        fontFamily: 'Poppins-Light'
    },
    descricao: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontFamily: 'Poppins-Light'
    },
    tag: {
        flexDirection: 'row',
        fontSize: 16,
        marginTop: 5,
        fontFamily: 'Poppins-Light'
    },
    disponivel: {
        backgroundColor: 'transparent',
        marginLeft: 10,
        minWidth: 60,
        border: '1px solid green',
        color: 'green',
        marginBottom: 3,
        fontFamily: 'Poppins-Light'
    },
    indisponivel: {
        backgroundColor: 'transparent',
        marginLeft: 10,
        minWidth: 60,
        border: '1px solid red',
        color: 'red',
        marginBottom: 3,
        fontFamily: 'Poppins-Light'
    },

    estrelas: {
        flexDirection: 'row',
        marginRight: 10,
        marginTop: 5

    }
});
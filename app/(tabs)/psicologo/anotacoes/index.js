import Header from '@/components/geral/header';
import { useAppContext } from "@/components/provider";
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from 'react-native-paper';


export default function Anotacoes() {
    const { pacientes } = useAppContext()

    return (
        <ScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} style={{backgroundColor:'white'}}>
            <Header corFundo={"#F37187"} href='psicologo/home'></Header>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.titulo}>ANOTAÇÕES</Text>
            </View>
            {pacientes.map(paciente => (
                <Card id={paciente.id} style={styles.card}>
                    <Card.Content style={styles.cardConteudo}>
                        <Image source={{ uri: paciente.imageUrl }} style={styles.imagemPerfil} />

                        <View style={styles.tituloCard}>
                            <Text style={styles.nome}>{paciente.nome}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Link href={`/psicologo/anotacoes/${paciente.id}`} >
                                <Ionicons name="chevron-forward-outline" size={20} color={'#F37187'} />
                            </Link>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    capa: {
        width: "100%",
        height: 90,
        backgroundColor: "#F37187",
        borderBottomLeftRadius: 27,
        borderBottomRightRadius: 27,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Esta propriedade é para Android
        flexDirection: 'row',
        justifyContent: 'flex-start',

    },
    voltar: {
        flex: 0,
        margin: 10,
    },
    imagemPerfil: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginBottom: 10,
        marginRight: 5
    },
    logo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titulo: {
        fontFamily: 'Poppins-Light',
        fontSize: 24,
        color: '#F37187',
        fontWeight: "bold",
        paddingVertical: 25
    },
    cardConteudo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    card: {
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    imagem: {
        width: 50,
        height: 50,
    },
    nome: {
        fontFamily: 'Poppins-Light',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
        flex: 1,
    },
    goBackButton: {
        marginRight: 10,
        alignItems: 'left'
    },
    tituloCard: {
        fontSize: 24,
        fontWeight: "bold"
    }
})
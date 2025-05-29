import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';

export default function PerfilPaciente() {
    const { usuarioAtual, buscaUsuarioId } = useAppContext();
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await buscaUsuarioId(usuarioAtual.id);
                setUser(userData);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        if (usuarioAtual) {
            fetchUserData();
        }
    }, [usuarioAtual]);

    const handleLogout = () => {
        navigation.navigate(' ');
    };

    const direcionaSair = () => {
        router.replace(' ');
    };

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
        );
    }

    return (
        <ScrollView style={{backgroundColor: "white"}} >
            <Header corFundo={"#477BDE"} href='/' style={styles.cabecalho}></Header>
            <View style={styles.scrollContainer}>
            <View style={styles.profileImageContainer}>
                <Image source={{ uri: user.data.imageUrl }} style={styles.profileImage} />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Nome</Text>
                    <Text style={styles.detailText}>{user.data.nome}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Data de aniversário</Text>
                    <Text style={styles.detailText}>{user.data.dataNascimento}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.detailText}>{user.data.email}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Número</Text>
                    <Text style={styles.detailText}>{user.data.telefone}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text style={styles.label}>Gênero</Text>
                    <Text style={styles.detailText}>{user.data.genero}</Text>
                </View>
            </View>
            

            <Button mode="contained" onPress={direcionaSair} buttonColor="#b31724" textColor='white' style={styles.designe}>
                Sair 
            </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: "white",
        flex: 1,
        width: '100%',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    // header: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     alignSelf: 'stretch',
    //     marginBottom: 20,
    //     marginTop: 20,
    //     paddingHorizontal: 20,
    // },

    headerText: {
        fontSize: 20,
        fontFamily: 'Poppins-Light',
        textAlign: 'center',
        flex: 1
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginRight: 10,
    },
    profileImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#dcdcdc',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    infoContainer: {
        width: '100%',
        padding: 10
    },
    detailContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Light',
        marginBottom: 5,
    },
    detailText: {
        height: 40,
        lineHeight: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        backgroundColor: '#f9f9f9',
        fontFamily: 'Poppins-Light'
    },
    logoutButton: {
        width: '100%',
        backgroundColor: '#b31724',
        padding: 9,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10

    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Light',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Light'
    },
    designe: {
        width:"93%",
    },
    cabecalho: {
        marginTop:0
    }
});

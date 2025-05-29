import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import CardHomePsi from '@/components/psicologo/cardHomePsi';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ListaPacientes() {
    const { pacientes } = useAppContext();

    return (
        <View style={styles.screenContainer}>
            <Header corFundo={'#F37187'} href='psicologo/home' />
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Meus Pacientes</Text>

                <Link href="psicologo/pacientes/cadastrarSessao" asChild>
                    <TouchableOpacity style={styles.botaoNovaSessao}>
                        <Ionicons name="add-circle-outline" size={20} color="white" />
                        <Text style={styles.textoBotao}>Nova Sessão</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {pacientes.length > 0 ? (
                    pacientes.map(paciente => (
                        <Link key={paciente.id} href={`psicologo/pacientes/${paciente.id}`} asChild>
                            <TouchableOpacity style={styles.cardContainer}>
                                <CardHomePsi paciente={paciente} />
                            </TouchableOpacity>
                        </Link>
                    ))
                ) : (
                    <Text style={styles.noPatients}>Nenhum paciente cadastrado.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
            backgroundColor: 'white',

    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 22,
        color: '#F37187',
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
    },
    scrollContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    botaoNovaSessao: {
        marginTop: 10,
        backgroundColor: '#F37187',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    textoBotao: {
        color: 'white',
        fontFamily: 'Poppins-Light',
        fontSize: 15,
    },
    noPatients: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 20,
    },
});

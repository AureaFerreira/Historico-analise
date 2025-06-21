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
            
            <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Meus Pacientes</Text>
                    <Text style={styles.subtitle}>Gerencie suas sessões e pacientes</Text>

                    <Link href="psicologo/pacientes/cadastrarSessao" asChild>
                        <TouchableOpacity style={styles.botaoNovaSessao}>
                            <Ionicons name="add-circle-outline" size={22} color="white" />
                            <Text style={styles.textoBotao}>Nova Sessão</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {pacientes.length > 0 ? (
                        pacientes.map(paciente => (
                            <Link key={paciente.id} href={`psicologo/pacientes/${paciente.id}`} asChild>
                                <TouchableOpacity style={styles.cardContainer}>
                                    <View style={styles.pacienteContainer}>
                                        <Text style={styles.pacienteNome}>{paciente.nome}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={48} color="#E0E0E0" />
                            <Text style={styles.noPatientsTitle}>Nenhum paciente cadastrado</Text>
                            <Text style={styles.noPatientsText}>Adicione pacientes para começar a gerenciar suas sessões</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    headerContainer: {
        marginVertical: 16,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 28,
        color: '#F37187',
        fontFamily: 'Poppins-Bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        marginBottom: 16,
    },
    scrollContainer: {
        paddingBottom: 24,
    },
    cardContainer: {
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: 'white',
        padding: 16,
    },
    pacienteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pacienteNome: {
        fontSize: 16,
        color: '#374151',
        fontFamily: 'Poppins-Medium',
        textShadowColor: 'transparent', // Remove qualquer sombra
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 0,
    },
    botaoNovaSessao: {
        marginTop: 8,
        backgroundColor: '#F37187',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textoBotao: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    noPatientsTitle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#374151',
        fontFamily: 'Poppins-SemiBold',
        marginTop: 16,
        marginBottom: 8,
    },
    noPatientsText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
});
import perfil from '@/assets/images/perfil.png';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FraseMotivacional from '../../../components/psicologo/frases';

export default function PerfilPsicologo() {

    return (
        <ScrollView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton}>
                    <Link href="/">
                        <Ionicons name="log-out-outline" size={30} color="white" />
                    </Link>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="settings-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image
                    source={perfil}
                    style={styles.avatar}
                />

            </View>

            {/* Estatísticas */}
            <View style={{

                padding: 10,
                marginHorizontal: 10,

            }}>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.name}>Dr. Jackson</Text>
                    <Text style={styles.id}>CRP : 12345678</Text>
                </View>
                <View style={styles.statsContainer}>

                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>235</Text>
                        <Text style={styles.statLabel}>Atendimentos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>68</Text>
                        <Text style={styles.statLabel}>Pacientes</Text>
                    </View>
                    {/* <View style={styles.statItem}>
                        <Text style={styles.statNumber}>540</Text>
                        <Text style={styles.statLabel}>Sessões</Text>
                    </View> */}
                </View>
            </View>
            <FraseMotivacional></FraseMotivacional>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: 'Poppins-Light',
        backgroundColor: '#f2f2f2',
    },
    header: {
        backgroundColor: '#F37187',
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },

    iconButton: {
        padding: 5,
    },

    avatarContainer: {
        alignItems: 'center',
        marginTop: -48,
    },
    avatar: {
        width: 96,
        height: 96,

        borderColor: '#ffffff',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
        fontFamily: 'Poppins-Light',

    },
    id: {
        color: '#6b7280',
        fontFamily: 'Poppins-Light',

    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // margin: 20,
        fontFamily: 'Poppins-Light',
        gap: 20,
        marginVertical: 5
    },
    statItem: {
        alignItems: 'center',
        fontFamily: 'Poppins-Light',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, // Pequeno deslocamento
        shadowOpacity: 0.1, // Opacidade bem leve
        shadowRadius: 2, // Espalhamento pequeno
        // Sombra no Android
        elevation: 2,

    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Semibold',
        color: '#F37187'

    },
    statLabel: {
        color: '#6b7280',
        fontFamily: 'Poppins-Light',

    },
    buttonContainer: {
        marginVertical: 2,
        marginBottom: 8,
        alignItems: 'center',

    },
    creditButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Poppins-Light',
    },
});
import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import logo from '@/assets/images/logoOnTerapia.png';

export default function EvolucaoCasos() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [casos, setCasos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCasos = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const mockData = [
                    { 
                        id: 1, 
                        paciente: 'Ana Silva', 
                        data: '15/06/2023', 
                        status: 'Em andamento',
                        tipo: 'Análise emocional por vídeo',
                        video: "consulta_ana_silva.mp4"
                    },
                    { 
                        id: 2, 
                        paciente: 'Carlos Oliveira', 
                        data: '22/06/2023', 
                        status: 'Concluído',
                        tipo: 'Expressões faciais e sentimentos',
                        video: "consulta_carlos_oliveira.mp4"
                    },
                    { 
                        id: 3, 
                        paciente: 'Mariana Costa', 
                        data: '05/07/2023', 
                        status: 'Em andamento',
                        tipo: 'Áudio + Vídeo com expressividade',
                        video: "consulta_mariana_costa.mp4"
                    },
                ];
                setCasos(mockData);
            } catch (error) {
                console.error("Erro ao buscar casos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCasos();
    }, []);

    const filteredCasos = casos.filter(caso =>
        caso.paciente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectCase = (caso) => {
        router.push('/psicologo/analiseEmocional');
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#F37187', '#FF7F9F']} style={styles.capa}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Image source={logo} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.headerTitle}>Evolução de Casos</Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
            </LinearGradient>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#F37187" style={{ marginTop: 50 }} />
            ) : filteredCasos.length > 0 ? (
                <FlatList
                    data={filteredCasos}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.caseCard} 
                            onPress={() => handleSelectCase(item)}
                        >
                            <View style={styles.caseInfo}>
                                <Text style={styles.caseName}>{item.paciente}</Text>
                                <Text style={styles.caseDate}>{item.data}</Text>
                                <Text style={styles.caseType}>{item.tipo}</Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                item.status === 'Concluído' ? styles.statusCompleted : styles.statusInProgress
                            ]}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>Nenhum caso encontrado</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    capa: {
        width: "100%",
        height: 180,
        borderBottomLeftRadius: 27,
        borderBottomRightRadius: 27,
        paddingTop: 55,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headerCenter: {
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        width: 40,
        alignItems: 'center',
    },
    logo: {
        width: 160,
        height: 40,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 15,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    caseCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
    },
    caseInfo: {
        flex: 1,
    },
    caseName: {
        fontWeight: '600',
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 3,
    },
    caseDate: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    caseType: {
        fontSize: 13,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
        marginRight: 10,
    },
    statusInProgress: {
        backgroundColor: '#FEF3C7',
    },
    statusCompleted: {
        backgroundColor: '#D1FAE5',
    },
    statusText: {
        fontWeight: '500',
        fontSize: 12,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: '#6B7280',
    }
});
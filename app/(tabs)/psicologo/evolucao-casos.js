import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator, Image, Alert // Importar Alert para feedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import logo from '@/assets/images/logoOnTerapia.png';

// ***** IMPORTANTE: Importe seu cliente Supabase configurado aqui *****
// Certifique-se de que o caminho para o seu arquivo supabase.js está correto.
// Por exemplo, se está em 'lib/supabase.js'
import { supabase } from '../../../../onterapia-dsi-2501/utils/supabase';

export default function EvolucaoCasos() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [pacientes, setPacientes] = useState([]); // Renomeado de 'casos' para 'pacientes' para refletir o dado real
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPacientes = async () => { // Função para buscar pacientes do Supabase
            setLoading(true);
            try {
                // ***** AQUI ESTÁ A LIGAÇÃO COM O SUPABASE *****
                // Use o nome EXATO da sua tabela de pacientes no Supabase.
                // Na sua imagem anterior, a tabela aparecia como 'Paciente'.
                // Se no Supabase ela está em minúsculo (ex: 'paciente'), mude aqui.
                const { data, error } = await supabase
                    .from('Paciente') // <--- VERIFIQUE E AJUSTE 'Paciente' para o nome EXATO da sua tabela
                    .select('id, nome, dataNascimento'); // Selecione as colunas que você precisa

                if (error) {
                    console.error("Erro ao buscar pacientes:", error);
                    Alert.alert("Erro", "Não foi possível carregar os pacientes.");
                    setPacientes([]); // Limpa a lista em caso de erro
                } else {
                    // Mapeia os dados do Supabase para o formato que você já estava usando no seu FlatList
                    // Adicionei 'idPaciente' para garantir que ele seja passado para a próxima tela.
                    const formattedPacientes = data.map(p => ({
                        id: p.id, // ID original do paciente (BIGINT do Supabase)
                        paciente: p.nome, // Nome do paciente
                        data: p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString('pt-BR') : 'Não informada',
                        status: 'Em andamento', // Estes são exemplos, podem ser dinâmicos se você tiver uma tabela de 'casos'
                        tipo: 'Análise emocional por vídeo', // Exemplo de tipo de caso
                        idPaciente: p.id // IMPORTANTE: Passa o ID do paciente para a próxima tela
                    }));
                    setPacientes(formattedPacientes);
                }
            } catch (error) {
                console.error("Erro inesperado ao buscar pacientes:", error);
                Alert.alert("Erro", "Ocorreu um erro inesperado ao carregar os pacientes.");
            } finally {
                setLoading(false);
            }
        };

        fetchPacientes(); // Chama a função ao carregar o componente
    }, []); // O array de dependências vazio garante que o useEffect rode apenas uma vez ao montar o componente

    // Ajusta o filtro para a nova variável 'pacientes'
    const filteredPacientes = pacientes.filter(p =>
        p.paciente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectCase = (pacienteData) => {
        // ***** AQUI ESTÁ A LIGAÇÃO PARA A TELA DE ANÁLISE EMOCIONAL *****
        // Passa o id (numérico) do paciente e o nome para a próxima tela.
        router.push({
            pathname: '/psicologo/analiseEmocional',
            params: {
                paciente: pacienteData.paciente, // Passa o nome do paciente
                idPaciente: pacienteData.id,     // Passa o ID numérico do paciente (importante para salvar no Supabase)
                data: pacienteData.data,         // Passa a data do paciente (data de cadastro ou similar)
            }
        });
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
            ) : filteredPacientes.length > 0 ? (
                <FlatList
                    data={filteredPacientes}
                    keyExtractor={item => item.id.toString()} // Usa o ID do paciente como chave
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.caseCard}
                            onPress={() => handleSelectCase(item)} // Passa o item completo
                        >
                            <View style={styles.caseInfo}>
                                <Text style={styles.caseName}>{item.paciente}</Text>
                                <Text style={styles.caseDate}>Data de Cadastro: {item.data}</Text>
                                {/* Exibe o status e tipo, que podem ser ajustados para refletir dados reais */}
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
                    <Text style={styles.noResultsText}>Nenhum paciente encontrado</Text>
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
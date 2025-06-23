    import React, { useState, useEffect } from 'react';
    import {
        View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert, Image
    } from 'react-native';
    import { useLocalSearchParams, useRouter } from 'expo-router';
    import { Ionicons } from '@expo/vector-icons';
    import { LinearGradient } from 'expo-linear-gradient';
    import logo from '@/assets/images/logoOnTerapia.png';

    // ***** CAMINHO CORRIGIDO PARA O SUPABASE *****
    // Assumindo que 'supabase.js' está em 'C:\Users\aurea\Documents\anne\onterapia-dsi-2501\utils\supabase.js'
    // E este arquivo está em 'C:\Users\aurea\Documents\anne\onterapia-dsi-2501\app\(tabs)\psicologo\HistoricoPaciente.js'
    import { supabase } from '../../../utils/supabase';

    export default function HistoricoPaciente() {
        const router = useRouter();
        const { idPaciente, nomePaciente } = useLocalSearchParams();
        
        const [loading, setLoading] = useState(true);
        const [historicoAnalises, setHistoricoAnalises] = useState([]);
        const [error, setError] = useState(null);

        useEffect(() => {
            console.log("HistoricoPaciente: Componente montado.");
            console.log("HistoricoPaciente: idPaciente recebido:", idPaciente);
            console.log("HistoricoPaciente: nomePaciente recebido:", nomePaciente);

            const fetchHistorico = async () => {
                if (!idPaciente) {
                    setError("ID do paciente não fornecido para carregar o histórico.");
                    setLoading(false);
                    console.warn("HistoricoPaciente: idPaciente é nulo ou indefinido.");
                    return;
                }

                setLoading(true);
                setError(null);
                console.log("HistoricoPaciente: Iniciando busca no Supabase para idPaciente:", idPaciente);
                try {
                    const { data, error } = await supabase
                        .from('reconhecimento_facial') // Nome EXATO da sua tabela de análises faciais
                        // ***** ADICIONEI 'url_imagem_analise' AQUI *****
                        // Você DEVE ter essa coluna na sua tabela 'reconhecimento_facial' no Supabase.
                        .select('id, data_analise, nome_arquivo_video, duracao_total, distribuicao_emocoes, analise_detalhada, notas_gerais, notas_grafico')
                        .eq('idpaciente', idPaciente) // FILTRA as análises pelo ID do paciente
                        .order('data_analise', { ascending: false });

                    if (error) {
                        console.error("HistoricoPaciente: Erro do Supabase ao buscar histórico:", error);
                        Alert.alert("Erro Supabase", "Não foi possível carregar o histórico: " + error.message);
                        setError("Erro ao carregar o histórico: " + error.message);
                        setHistoricoAnalises([]);
                    } else {
                        console.log("HistoricoPaciente: Dados do histórico carregados com sucesso:", data);
                        if (data && data.length === 0) {
                            console.log("HistoricoPaciente: Nenhuma análise encontrada para este paciente.");
                        }
                        setHistoricoAnalises(data);
                    }
                } catch (err) {
                    console.error("HistoricoPaciente: Erro inesperado no fetchHistorico:", err);
                    Alert.alert("Erro Inesperado", "Ocorreu um erro inesperado ao carregar o histórico.");
                    setError("Ocorreu um erro inesperado: " + err.message);
                    setHistoricoAnalises([]);
                } finally {
                    setLoading(false);
                    console.log("HistoricoPaciente: Busca finalizada. Loading set para false.");
                }
            };

            fetchHistorico();
        }, [idPaciente]);

        const formatarData = (isoString) => {
            if (!isoString) return 'Data Indisponível';
            const date = new Date(isoString);
            return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        };

        const formatarDuracao = (totalSeconds) => {
            if (typeof totalSeconds !== 'number' || isNaN(totalSeconds)) return '0s';
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}m ${seconds}s`;
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
                            <Text style={styles.headerTitle}>Histórico de Análises</Text>
                            <Text style={styles.patientName}>{nomePaciente || 'Paciente Desconhecido'}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </LinearGradient>

                {loading ? (
                    <ActivityIndicator size="large" color="#F37187" style={styles.loadingIndicator} />
                ) : error ? (
                    <View style={styles.messageContainer}>
                        <Ionicons name="alert-circle-outline" size={50} color="#EF4444" />
                        <Text style={styles.messageText}>{error}</Text>
                        <Text style={styles.messageTextSmall}>Verifique sua conexão ou tente novamente.</Text>
                    </View>
                ) : historicoAnalises.length === 0 ? (
                    <View style={styles.messageContainer}>
                        <Ionicons name="folder-open-outline" size={60} color="#9CA3AF" />
                        <Text style={styles.messageText}>Nenhuma análise facial encontrada para este paciente.</Text>
                        <Text style={styles.messageTextSmall}>As análises aparecerão aqui após serem realizadas.</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.listContent}>
                        {historicoAnalises.map((analise) => (
                            <TouchableOpacity
                                key={analise.id}
                                style={styles.analysisCard}
                                // Opcional: Adicionar onPress para ver detalhes de uma análise específica
                                // onPress={() => router.push({ pathname: '/psicologo/detalheAnalise', params: { analise: JSON.stringify(analise) }})}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>Análise de {formatarData(analise.data_analise)}</Text>
                                    <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
                                </View>

                                {/* ***** EXIBIR A IMAGEM AQUI ***** */}
                            
                                
                                <Text style={styles.cardDetail}>
                                    <Text style={styles.cardLabel}>Vídeo: </Text>
                                    {analise.nome_arquivo_video || 'Nome do vídeo não informado'}
                                </Text>
                                <Text style={styles.cardDetail}>
                                    <Text style={styles.cardLabel}>Duração: </Text>
                                    {formatarDuracao(analise.duracao_total)}
                                </Text>
                                <Text style={styles.cardDetail}>
                                    <Text style={styles.cardLabel}>Notas Gerais: </Text>
                                    {analise.notas_gerais ? analise.notas_gerais.substring(0, 100) + (analise.notas_gerais.length > 100 ? '...' : '') : 'Sem notas gerais'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
            alignItems: 'center',
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            width: '100%',
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
            marginBottom: 5,
        },
        patientName: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Poppins-Bold',
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
        },
        loadingIndicator: {
            marginTop: 50,
        },
        messageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#FFF',
            margin: 20,
            borderRadius: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        messageText: {
            fontSize: 18,
            fontWeight: '600',
            color: '#4B5563',
            textAlign: 'center',
            marginTop: 10,
        },
        messageTextSmall: {
            fontSize: 14,
            color: '#6B7280',
            textAlign: 'center',
            marginTop: 5,
        },
        listContent: {
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        analysisCard: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
        },
        cardTitle: {
            fontSize: 17,
            fontWeight: '700',
            color: '#1F2937',
            flex: 1,
        },
        cardDetail: {
            fontSize: 14,
            color: '#4B5563',
            marginBottom: 4,
        },
        cardLabel: {
            fontWeight: '600',
            color: '#374151',
        },
        analysisImage: {
            width: '100%',
            height: 180,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: '#E5E7EB',
        },
    });
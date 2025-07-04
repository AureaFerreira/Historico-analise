import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import logoOnTerapia from '@/assets/images/logoOnTerapia.png';

export default function PersonalizarAnamnese() {
    const router = useRouter();
    const [nomePaciente, setNomePaciente] = useState('');
    const [telefonePaciente, setTelefonePaciente] = useState('');
    const [emailPaciente, setEmailPaciente] = useState('');
    const [confirmouDados, setConfirmouDados] = useState(false);
    const [usarPadrao, setUsarPadrao] = useState(null);
    const [novaPergunta, setNovaPergunta] = useState('');
    const [tipoPergunta, setTipoPergunta] = useState('Texto livre');
    const [perguntas, setPerguntas] = useState([]);
    const [resumoVisivel, setResumoVisivel] = useState(false);
    const [anamneseSalva, setAnamneseSalva] = useState(false);
    const [codigoAnamnese, setCodigoAnamnese] = useState('');

    const mapearTipo = (tipoTexto) => {
        if (tipoTexto === 'Sim/Não') return 'boolean';
        if (tipoTexto === 'Número') return 'number';
        return 'text';
    };

    const confirmarDadosPaciente = () => {
        if (!nomePaciente.trim() || !telefonePaciente.trim() || !emailPaciente.trim()) {
            Alert.alert("Erro", "Por favor, preencha todos os campos do paciente.");
            return;
        }
        setConfirmouDados(true);
    };

    const adicionarPergunta = () => {
        if (!novaPergunta.trim()) {
            Alert.alert("Atenção", "Por favor, digite a pergunta antes de adicionar.");
            return;
        }
        const tipoPadronizado = mapearTipo(tipoPergunta);
        setPerguntas(prev => [...prev, { pergunta: novaPergunta.trim(), tipo: tipoPadronizado }]);
        setNovaPergunta('');
        setTipoPergunta('Texto livre');
    };

    const fetchPerguntasPadrao = async () => {
        try {
            const resposta = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: 'psicologo_' + Date.now(),
                    message: '/get_perguntas_padrao'
                })
            });
            const json = await resposta.json();
            const mensagemBot = json.find(m => m?.custom?.perguntas_padrao);
            if (mensagemBot) {
                setPerguntas(mensagemBot.custom.perguntas_padrao);
                setUsarPadrao(true);
            } else {
                Alert.alert("Erro", "O bot não retornou as perguntas padrão.");
            }
        } catch (error) {
            console.error("Erro ao buscar perguntas padrão:", error);
            Alert.alert("Erro de conexão", "Não foi possível conectar ao Rasa para buscar as perguntas padrão.");
        }
    };

    const enviarWhatsapp = async () => {
        const codigo = codigoAnamnese || "ABC123";
        const telefoneFormatado = telefonePaciente.replace(/\D/g, '');
        const numeroDestino = `+55${telefoneFormatado}`;

        console.log("📤 Enviando mensagem para:", numeroDestino);
        console.log("📦 Código da anamnese:", codigo);

        try {
            const response = await fetch("https://graph.facebook.com/v18.0/667993296396200/messages", {
                method: "POST",
                headers: {
                    Authorization: `Bearer EAAUXxNBpOS0BO47jb1pdr7Tzl7H8MwebhcuKUlbZAQTV9pYojHWhPPd7jHBWTEwnctTtdkoQXEGc90tcj6f4FGkZClx161vDp8UIiaNjsuk7DzOASvB7ZCvX1pVZCLUfqUqNNJTAlzo5B6UXZAmJ6ZCy9vabq0ZBB5ZCHWLxo1OZB85JBua5YGYm88x8ohOZB5VCsuIl3s9MbcsVmJeZANSEIZCJHqZCBdfBCeRAZAbl16JwZDZD`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: numeroDestino,
                    type: "template",
                    template: {
                        name: "modelo_anamnese",
                        language: { code: "pt_BR" },
                        components: [
                            {
                                type: "body",
                                parameters: [
                                    {
                                        type: "text",
                                        text: codigo
                                    }
                                ]
                            }
                        ]
                    }
                })
            });

            const result = await response.json();
            console.log("📨 Resposta da API:", JSON.stringify(result, null, 2));

            if (!response.ok) {
                Alert.alert("Erro ao enviar WhatsApp", result.error?.message || "Falha desconhecida ao enviar.");
            } else {
                Alert.alert("Sucesso", "Mensagem enviada com sucesso via WhatsApp!");
            }

        } catch (err) {
            console.error("❌ Erro na conexão com API do WhatsApp:", err);
            Alert.alert("Erro", "Não foi possível conectar com a API do WhatsApp. Verifique sua conexão ou token.");
        }
    };

    const salvarAnamnese = async () => {
        if (perguntas.length === 0) {
            Alert.alert("Erro", "Adicione ao menos uma pergunta para salvar a anamnese.");
            return;
        }
        const perguntasConvertidas = perguntas.map(p => ({ pergunta: p.pergunta, tipo: p.tipo }));
        try {
            const res = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: 'psicologo_' + Date.now(),
                    message: '/salvar_anamnese',
                    metadata: {
                        nome: nomePaciente,
                        perguntas: perguntasConvertidas
                    }
                })
            });
            const resposta = await res.json();
            const mensagemComCodigo = resposta.find(m => m.custom?.codigo);
            const codigoReal = mensagemComCodigo?.custom?.codigo;
            if (codigoReal) {
                setCodigoAnamnese(codigoReal);
                setAnamneseSalva(true);
            } else {
                Alert.alert("Erro", "O bot não retornou o código da anamnese. Verifique a configuração do Rasa.");
            }
        } catch (error) {
            console.error("Erro ao salvar anamnese:", error);
            Alert.alert("Erro", "Não foi possível salvar a anamnese. Verifique a conexão com o Rasa.");
        }
    };

    const resetarTudo = () => {
        setNomePaciente('');
        setTelefonePaciente('');
        setEmailPaciente('');
        setConfirmouDados(false);
        setUsarPadrao(null);
        setNovaPergunta('');
        setTipoPergunta('Texto livre');
        setPerguntas([]);
        setResumoVisivel(false);
        setAnamneseSalva(false);
        setCodigoAnamnese('');
    };

    if (anamneseSalva) {
        return (
            <View style={styles.telaSucesso}>
                <LinearGradient colors={['#F37187', '#FF7F9F']} style={styles.capa}>
                    <View style={styles.headerContent}>
            
                        <TouchableOpacity onPress={resetarTudo} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Anamnese</Text>
                        <View style={styles.backButton} />
                    </View>
                </LinearGradient>

                <View style={styles.conteudoCentral}>
                    <Text style={styles.titulo}>Anamnese salva com sucesso!</Text>

                    <Text style={styles.subtitulo}>Código da anamnese:</Text>
                    <View style={styles.codigoBox}>
                        <Text style={styles.codigo}>{codigoAnamnese}</Text>
                    </View>

                    <Text style={styles.instrucoes}>
                        *Esse é o código de acesso do paciente para responder à anamnese pelo aplicativo OnTerapia.*
                    </Text>

                    <TouchableOpacity style={styles.botaoAzul} onPress={enviarWhatsapp}>
                        <Text style={styles.botaoTexto}>Enviar código por WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botaoVerde2} onPress={resetarTudo}>
                        <Text style={styles.botaoTexto}>Voltar para o início</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!confirmouDados) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#F37187', '#FF7F9F']} style={styles.capa}>
                    <View style={styles.headerContent}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="white" />
    </TouchableOpacity>
    
    <View style={styles.logoTitleContainer}>
        <Image source={logoOnTerapia} style={styles.logo} />
        <Text style={styles.headerTitle}>Anamnese</Text>
    </View>
    
    <View style={styles.backButton} />
</View>
                </LinearGradient>

                <ScrollView style={styles.scrollView}>
                    <Text style={styles.titulo}>Cadastrar Paciente</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome completo"
                        value={nomePaciente}
                        onChangeText={setNomePaciente}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Telefone com DDD (ex: 63984031205)"
                        value={telefonePaciente}
                        onChangeText={setTelefonePaciente}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        value={emailPaciente}
                        onChangeText={setEmailPaciente}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.botaoVerde} onPress={confirmarDadosPaciente}>
                        <Text style={styles.botaoTexto}>Avançar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#F37187', '#FF7F9F']} style={styles.capa}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Anamnese</Text>
                    <View style={styles.backButton} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView}>
                <Text style={styles.titulo}>Personalizar Anamnese</Text>

                {resumoVisivel ? (
                    <>
                        <Text style={styles.subtitulo}>Resumo da Anamnese de {nomePaciente}</Text>
                        {perguntas.map((p, i) => (
                            <View key={i} style={styles.cardPergunta}>
                                <View style={styles.perguntaConteudo}>
                                    <Text style={styles.perguntaTexto}>{p.pergunta}</Text>
                                    <Text style={styles.tipoRespostaTexto}>
                                        Tipo: {p.tipo === 'boolean' ? 'Sim/Não' : p.tipo === 'number' ? 'Número' : 'Texto livre'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        <View style={styles.colunaBotoes}>
                            <TouchableOpacity onPress={() => setResumoVisivel(false)} style={styles.botaoAzul}>
                                <Text style={styles.botaoTexto}>Editar Anamnese</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={salvarAnamnese} style={styles.botaoVerde}>
                                <Text style={styles.botaoTexto}>Salvar Anamnese</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : usarPadrao === null ? (
                    <View style={styles.cardPadrao}>
                        <Text style={styles.subtituloCard}>Deseja usar a anamnese padrão?</Text>
                        <View style={styles.linhaCentralizada}>
                            <TouchableOpacity style={styles.botaoOpcaoRosa} onPress={fetchPerguntasPadrao}>
                                <Text style={styles.opcaoTexto}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.botaoOpcaoRosa}
                                onPress={() => {
                                    setPerguntas([]);
                                    setUsarPadrao(false);
                                }}
                            >
                                <Text style={styles.opcaoTexto}>Não, quero criar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <Text style={styles.subtitulo}>Adicionar Perguntas</Text>
                        <View style={styles.painelPerguntaColuna}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite a pergunta"
                                value={novaPergunta}
                                onChangeText={setNovaPergunta}
                                multiline
                            />

                            <Text style={styles.label}>Tipo de resposta</Text>
                            <View style={styles.tipoContainer}>
                                {['Texto livre', 'Sim/Não', 'Número'].map((tipo) => (
                                    <TouchableOpacity
                                        key={tipo}
                                        style={[
                                            styles.botaoTipo,
                                            tipoPergunta === tipo && styles.botaoTipoSelecionado
                                        ]}
                                        onPress={() => setTipoPergunta(tipo)}
                                    >
                                        <Text
                                            style={[
                                                styles.textoBotaoTipo,
                                                tipoPergunta === tipo && styles.textoSelecionado
                                            ]}
                                        >
                                            {tipo}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity onPress={adicionarPergunta} style={styles.botaoAdd}>
                                <Text style={styles.botaoTexto}>Adicionar Pergunta</Text>
                            </TouchableOpacity>
                        </View>

                        {perguntas.length > 0 && (
                            <>
                                <Text style={styles.subtitulo}>Perguntas Adicionadas</Text>
                                <FlatList
                                    data={perguntas}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.cardPergunta}>
                                            <View style={styles.perguntaConteudo}>
                                                <Text style={styles.perguntaTexto}>{item.pergunta}</Text>
                                                <Text style={styles.tipoRespostaTexto}>
                                                    Tipo: {item.tipo === 'boolean' ? 'Sim/Não' : item.tipo === 'number' ? 'Número' : 'Texto livre'}
                                                </Text>
                                            </View>
                                            <View style={styles.icones}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setNovaPergunta(item.pergunta);
                                                        setTipoPergunta(
                                                            item.tipo === 'boolean' ? 'Sim/Não' :
                                                            item.tipo === 'number' ? 'Número' : 'Texto livre'
                                                        );
                                                        setPerguntas(perguntas.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <Ionicons name="pencil-outline" size={20} color="#3b82f6" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => Alert.alert(
                                                        "Remover Pergunta",
                                                        "Tem certeza que deseja remover esta pergunta?",
                                                        [
                                                            { text: "Cancelar", style: "cancel" },
                                                            { text: "Remover", onPress: () => setPerguntas(perguntas.filter((_, i) => i !== index)) }
                                                        ]
                                                    )}
                                                >
                                                    <Ionicons name="close-outline" size={24} color="#ef4444" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    scrollEnabled={false}
                                />
                            </>
                        )}

                        {perguntas.length > 0 && (
                            <TouchableOpacity onPress={salvarAnamnese} style={styles.botaoVerde}>
                                <Text style={styles.botaoTexto}>Salvar Anamnese</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </ScrollView>
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
    paddingTop: 10,
    },

    logoTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
},
    backButton: {
        width: 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,  // Reduzi o tamanho
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    marginTop: 5,  // Espaço entre logo e título
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    },
    scrollView: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    titulo: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 20
    },
    subtitulo: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#1F2937',
        textAlign: 'center',
        marginVertical: 10
    },
    subtituloCard: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginBottom: 6,
        color: '#374151'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#fff',
        marginBottom: 12
    },
    cardPadrao: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        marginTop: 20,
        marginBottom: 20
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Poppins-Bold'
    },
    linhaCentralizada: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginTop: 10
    },
    botaoOpcaoRosa: {
        backgroundColor: '#f43f5e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    opcaoTexto: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: '#fff'
    },
    painelPerguntaColuna: {
        marginTop: 10,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 20
    },
    tipoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 10
    },
    botaoTipo: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db'
    },
    botaoTipoSelecionado: {
        backgroundColor: '#ffe4e9',
        borderColor: '#f43f5e'
    },
    textoBotaoTipo: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#1f2937'
    },
    textoSelecionado: {
        fontFamily: 'Poppins-Bold',
        color: '#be123c'
    },
    botaoAdd: {
        backgroundColor: '#22c55e',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
   logo: {
   width: 160,
        height: 40,
        marginBottom: 4,
    resizeMode: 'contain',
    tintColor: 'white',
    },
    cardPergunta: {
        backgroundColor: '#ffe4e9',
        borderRadius: 10,
        padding: 12,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    perguntaTexto: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: '#111827'
    },
    tipoRespostaTexto: {
        fontSize: 12,
        fontStyle: 'italic',
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
        marginTop: 2
    },
    icones: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginLeft: 8,
    },
    colunaBotoes: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 20,
        marginBottom: 20
    },
    botaoVerde: {
        backgroundColor: '#22c55e',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    telaSucesso: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    conteudoCentral: {
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
        gap: 14,
    },
    codigoBox: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 4,
    },
    codigo: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#be123c',
        letterSpacing: 2,
    },
    instrucoes: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#6B7280',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        marginBottom: 10,
    },
    botaoAzul: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        maxWidth: 280,
        marginBottom: 10
    },
    botaoVerde2: {
        backgroundColor: '#22c55e',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        maxWidth: 280,
    },
    perguntaConteudo: {
        flex: 1
    }
});
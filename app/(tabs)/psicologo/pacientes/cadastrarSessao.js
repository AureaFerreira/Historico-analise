import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert 
} from 'react-native';
import { Switch } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';

export default function NovaSessaoJitsi() {
    const { pacientes, adicionarSessao } = useAppContext();
    const router = useRouter();
    
    // Estados do formulário
    const [pacienteSelecionado, setPacienteSelecionado] = useState('');
    const [data, setData] = useState(new Date());
    const [mostrarData, setMostrarData] = useState(false);
    const [repetirSemanalmente, setRepetirSemanalmente] = useState(false);
    const [observacoes, setObservacoes] = useState('');
    const [enviarLembrete, setEnviarLembrete] = useState(true);

    // Gerar nome da sala Jitsi (único para cada sessão)
    const generateRoomName = () => {
        const paciente = pacientes.find(p => p.id === pacienteSelecionado);
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        return `PsicoSessao-${paciente?.nome?.replace(/\s/g, '')}-${randomSuffix}`;
    };

    const handleSalvar = () => {
        if (!pacienteSelecionado) {
            Alert.alert('Atenção', 'Selecione um paciente');
            return;
        }

        const novaSessao = {
            id: Date.now().toString(),
            pacienteId: pacienteSelecionado,
            data,
            linkJitsi: `https://meet.jit.si/${generateRoomName()}`,
            repetirSemanalmente,
            enviarLembrete,
            observacoes,
            status: 'agendada'
        };

        adicionarSessao(novaSessao); // Salva no contexto/banco de dados
        Alert.alert('Sucesso', 'Sessão agendada com sucesso!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header corFundo="#F37187" href="psicologo/pacientes" />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.titulo}>Agendar Sessão Online</Text>

                {/* Seção Paciente */}
                <Text style={styles.label}>Paciente *</Text>
                <View style={styles.selectContainer}>
                    {pacientes.map(p => (
                        <TouchableOpacity
                            key={p.id}
                            style={[
                                styles.patientOption,
                                pacienteSelecionado === p.id && styles.selectedPatientOption,
                            ]}
                            onPress={() => setPacienteSelecionado(p.id)}
                        >
                            <Text style={[
                                styles.patientText,
                                pacienteSelecionado === p.id && styles.selectedPatientText,
                            ]}>
                                {p.nome}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Seção Data/Horário */}
                <Text style={styles.label}>Data e Horário *</Text>
                <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setMostrarData(true)}
                >
                    <Text style={styles.inputText}>
                        {data.toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </TouchableOpacity>
                {mostrarData && (
                    <DateTimePicker
                        value={data}
                        mode="datetime"
                        is24Hour={true}
                        minimumDate={new Date()}
                        onChange={(_, dateSelecionada) => {
                            setMostrarData(false);
                            if (dateSelecionada) setData(dateSelecionada);
                        }}
                    />
                )}

                {/* Seção Observações */}
                <Text style={styles.label}>Observações</Text>
                <TextInput
                    style={[styles.input, styles.observationsInput]}
                    placeholder="Ex: Trabalhar ansiedade, abordagem CBT"
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline
                />

                {/* Configurações Adicionais */}
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Repetir semanalmente?</Text>
                    <Switch
                        value={repetirSemanalmente}
                        onValueChange={setRepetirSemanalmente}
                        color="#F37187"
                    />
                </View>

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Enviar lembrete automático?</Text>
                    <Switch
                        value={enviarLembrete}
                        onValueChange={setEnviarLembrete}
                        color="#F37187"
                    />
                </View>

                {/* Botão Salvar */}
                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={handleSalvar}
                >
                    <Text style={styles.saveButtonText}>Agendar Sessão</Text>
                </TouchableOpacity>

                <Text style={styles.note}>
                    Um link exclusivo do Jitsi será gerado automaticamente para esta sessão.
                </Text>
            </ScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    titulo: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#F37187',
        marginVertical: 20,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 8,
        color: '#4B5563',
    },
    input: {
        backgroundColor: '#F3F4F6',
        padding: 14,
        borderRadius: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginBottom: 5,
    },
    inputText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#1F2937',
    },
    selectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 15,
    },
    patientOption: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    selectedPatientOption: {
        backgroundColor: '#F37187',
    },
    patientText: {
        fontFamily: 'Poppins-Regular',
        color: '#4B5563',
    },
    selectedPatientText: {
        color: 'white',
    },
    observationsInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    saveButton: {
        backgroundColor: '#F37187',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        elevation: 3,
    },
    saveButtonText: {
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
    },
    note: {
        fontFamily: 'Poppins-Light',
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 15,
    },
});
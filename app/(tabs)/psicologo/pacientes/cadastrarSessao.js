import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Switch } from 'react-native-paper';

import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NovaSessao() {
    const { pacientes } = useAppContext();
    const [pacienteSelecionado, setPacienteSelecionado] = useState('');
    const [data, setData] = useState(new Date());
    const [mostrarData, setMostrarData] = useState(false);
    const [repetirSemanalmente, setRepetirSemanalmente] = useState(false);

    const handleSalvar = () => {
        // Lógica de salvar sessão
        console.log({
            pacienteSelecionado,
            data,
            repetirSemanalmente,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container} style={{backgroundColor:'white'}}>
            <Header corFundo="#F37187" href="psicologo/pacientes" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.titulo}>Nova Sessão</Text>

                <Text style={styles.label}>Paciente</Text>
                <View style={styles.select}>
                    {pacientes.map(p => (
                        <TouchableOpacity
                            key={p.id}
                            style={[
                                styles.opcao,
                                pacienteSelecionado === p.id && styles.opcaoSelecionada,
                            ]}
                            onPress={() => setPacienteSelecionado(p.id)}
                        >
                            <Text style={styles.textoOpcao}>{p.nome}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Data e Horário</Text>
                <TouchableOpacity style={styles.input} onPress={() => setMostrarData(true)}>
                    <Text style={styles.inputText}>{data.toLocaleString()}</Text>
                </TouchableOpacity>
                {mostrarData && (
                    <DateTimePicker
                        value={data}
                        mode="datetime"
                        is24Hour={true}
                        onChange={(_, dateSelecionada) => {
                            setMostrarData(false);
                            if (dateSelecionada) setData(dateSelecionada);
                        }}
                    />
                )}

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Repetir semanalmente?</Text>
                    <Switch
                        value={repetirSemanalmente}
                        onValueChange={setRepetirSemanalmente}
                        // trackColor={{ true: '#F37187' }}
                        color={'#F37187' }
                    />
                </View>

                <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
                    <Text style={styles.textoSalvar}>Salvar Sessão</Text>
                </TouchableOpacity>
            </ScrollView>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
      backgroundColor: 'white',

    },
     scrollContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    titulo: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#F37187',
        marginVertical: 10,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'Poppins-Light',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 5,
        color: '#1f2937',
    },
    input: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        borderRadius: 10,
    },
    inputText: {
        fontFamily: 'Poppins-Light',
        fontSize: 15,
    },
    select: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    opcao: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 10,
    },
    opcaoSelecionada: {
        backgroundColor: '#F37187',
    },
    textoOpcao: {
        fontFamily: 'Poppins-Light',
        color: '#1f2937',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    botaoSalvar: {
        backgroundColor: '#F37187',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    textoSalvar: {
        color: '#fff',
        fontFamily: 'Poppins-Light',
        fontSize: 16,
    },
});

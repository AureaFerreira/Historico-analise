import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Switch } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import { supabase } from '@/utils/supabase';

export default function NovaSessao() {
  const { pacientes, usuarioAtual } = useAppContext();
  const navigation = useRouter();

  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [qtdSessoes, setQtdSessoes] = useState(1);
  const [valor, setValor] = useState('');
  const [notasDeSessao, setNotasDeSessao] = useState('');
  const [intervalo, setIntervalo] = useState('7'); // Padrão: 1 semana
  const [enviarLembrete, setEnviarLembrete] = useState(true);
  const [notificarPsicologo, setNotificarPsicologo] = useState(false);
  const [contrato, setContrato] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!pacienteSelecionado) {
      Alert.alert('Atenção', 'Selecione um paciente');
      return;
    }

    setLoading(true);
    try {
      const diaISO = data.toISOString().slice(0, 10);
      const horaISO = data.toISOString().slice(11, 16);

      const { error } = await supabase.from('Sessao').insert({
        idPsicologo: usuarioAtual.id,
       IdPaciente: pacienteSelecionado,
        data: diaISO,
        hora_inicio: horaISO,
        qtdSessoes: qtdSessoes,
        valor: valor ? parseFloat(valor) : null,
        notasDeSessao: `{${notasDeSessao}}`, // isso transforma em formato literal de array
        id_agenda: null,
        qtdSessoesFeitas: 0,
        intervalo: intervalo || null,
        ativa: true,
        notificacaoPsicologo: notificarPsicologo,
        notificacaoPaciente: enviarLembrete,
        contrato: contrato,
      });

      if (error) throw error;

      Alert.alert('Sucesso', 'Sessão agendada com sucesso!', [
        { text: 'OK', onPress: () => navigation.back() },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível agendar a sessão');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (date) =>
    date
      .toLocaleString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(/-feira$/, '');

  return (
    <View style={styles.container}>
      <Header corFundo="#F37187" href="psicologo/pacientes" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="calendar" size={28} color="#F37187" />
          <Text style={styles.titulo}>Agendar Nova Sessão</Text>
          <Text style={styles.subtitulo}>Preencha os detalhes da sessão</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paciente</Text>
          <View style={styles.card}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pacientes.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.patientOption,
                    pacienteSelecionado === p.id && styles.selectedPatientOption,
                  ]}
                  onPress={() => setPacienteSelecionado(p.id)}
                >
                  <Text
                    style={[
                      styles.patientText,
                      pacienteSelecionado === p.id && styles.selectedPatientText,
                    ]}
                  >
                    {p.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data e Horário</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setMostrarData(true)}
            >
              <MaterialIcons name="access-time" size={24} color="#F37187" />
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateText}>{formatarData(data)}</Text>
                <Text style={styles.dateHint}>Toque para alterar</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            {mostrarData && (
              <DateTimePicker
                value={data}
                mode="datetime"
                is24Hour
                minimumDate={new Date()}
                onChange={(_, d) => {
                  setMostrarData(false);
                  if (d) setData(d);
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações da Sessão</Text>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Quantidade de Sessões</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={qtdSessoes.toString()}
                onChangeText={(text) => setQtdSessoes(parseInt(text) || 1)}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Valor (opcional)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="R$ 0,00"
                value={valor}
                onChangeText={setValor}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Intervalo entre sessões (dias)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={intervalo}
                onChangeText={setIntervalo}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anotações</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.textArea}
              placeholder="Notas sobre esta sessão..."
              multiline
              numberOfLines={4}
              value={notasDeSessao}
              onChangeText={setNotasDeSessao}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <MaterialIcons name="notifications" size={20} color="#F37187" />
                <View style={styles.switchLabelContainer}>
                  <Text style={styles.switchLabel}>Notificar paciente</Text>
                  <Text style={styles.switchSubLabel}>Enviar lembrete para o paciente</Text>
                </View>
              </View>
              <Switch
                value={enviarLembrete}
                onValueChange={setEnviarLembrete}
                color="#F37187"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <MaterialIcons name="notifications" size={20} color="#F37187" />
                <View style={styles.switchLabelContainer}>
                  <Text style={styles.switchLabel}>Notificar psicólogo</Text>
                  <Text style={styles.switchSubLabel}>Receber notificação</Text>
                </View>
              </View>
              <Switch
                value={notificarPsicologo}
                onValueChange={setNotificarPsicologo}
                color="#F37187"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <MaterialIcons name="description" size={20} color="#F37187" />
                <View style={styles.switchLabelContainer}>
                  <Text style={styles.switchLabel}>Contrato assinado</Text>
                  <Text style={styles.switchSubLabel}>Paciente assinou o contrato</Text>
                </View>
              </View>
              <Switch
                value={contrato}
                onValueChange={setContrato}
                color="#F37187"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialIcons name="check-circle" size={22} color="white" />
              <Text style={styles.saveButtonText}>Confirmar Agendamento</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  titulo: { fontSize: 26, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 10, marginBottom: 4 },
  subtitulo: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#6B7280', textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#374151', marginBottom: 12, marginLeft: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, elevation: 2 },
  patientOption: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 12, alignItems: 'center', minWidth: 100, marginRight: 10 },
  selectedPatientOption: { backgroundColor: '#FEE2E2', borderWidth: 2, borderColor: '#F37187' },
  patientText: { fontFamily: 'Poppins-Medium', fontSize: 14, color: '#4B5563', textAlign: 'center' },
  selectedPatientText: { color: '#F37187', fontFamily: 'Poppins-SemiBold' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  dateTextContainer: { flex: 1, marginHorizontal: 12 },
  dateText: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#111827' },
  dateHint: { fontFamily: 'Poppins-Light', fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  inputLabel: { fontFamily: 'Poppins-Medium', fontSize: 15, color: '#374151', flex: 1 },
  input: { 
    fontFamily: 'Poppins-Regular', 
    fontSize: 15, 
    color: '#111827',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    minWidth: 100,
    textAlign: 'right'
  },
  textArea: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  switchTextContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  switchLabelContainer: { marginLeft: 12 },
  switchLabel: { fontFamily: 'Poppins-Medium', fontSize: 15, color: '#374151' },
  switchSubLabel: { fontFamily: 'Poppins-Light', fontSize: 12, color: '#6B7280', marginTop: 2 },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F37187',
    padding: 18,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: '#F37187',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  disabledButton: { backgroundColor: '#E5E7EB' },
  saveButtonText: { color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 17 },
});
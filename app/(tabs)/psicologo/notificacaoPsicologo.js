import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card, RadioButton } from 'react-native-paper';

/**
 * Tela de notificações do psicólogo
 * - Mostra NÃO LIDAS e LIDAS
 * - Se o provider não devolver nada, exibe um exemplo estático
 */
export default function NotificacaoPsicologo() {
  const {
    notificacao_por_psicologo,
    marcarNotificacaoComoLidaPsicologo,
    usuarioAtual,
    pacientes,
  } = useAppContext();

  const [naoLidas, setNaoLidas] = useState([]);
  const [lidas, setLidas]   = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  /* -------- nome do paciente (join opcional) -------- */
  const nomePaciente = (s) =>
    s.Paciente?.nome ||
    pacientes.find((p) => p.id === s.IdPaciente)?.nome ||
    'Paciente';

  /* -------- formatar data -------- */
  const fmtDataHora = (d, h) =>
    new Date(`${d}T${h}`).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  /* -------- carrega do provider -------- */
  const carregar = useCallback(async () => {
    try {
      const data = await notificacao_por_psicologo(usuarioAtual.id);

      if (data.length) {
        data.sort(
          (a, b) =>
            new Date(`${a.data}T${a.hora_inicio}`) -
            new Date(`${b.data}T${b.hora_inicio}`)
        );
        setNaoLidas(data.filter((s) => !s.notificacaoPsicologo));
        setLidas(data.filter((s) => s.notificacaoPsicologo));
      } else {
        // fallback estático
        const exemplo = [
          {
            idSessao: 'demo‑01',
            IdPaciente: pacientes[0]?.id || 'demoPac',
            data: '2025-06-20',
            hora_inicio: '14:00',
            notificacaoPsicologo: false,
          },
          {
            idSessao: 'demo‑01',
            IdPaciente: pacientes[1]?.id || 'demoPac',
            data: '2025-06-20',
            hora_inicio: '14:00',
            notificacaoPsicologo: false,
          },
          {
            idSessao: 'demo‑01',
            IdPaciente: pacientes[3]?.id || 'demoPac',
            data: '2025-06-20',
            hora_inicio: '14:00',
            notificacaoPsicologo: false,
          },
        ];
        setNaoLidas(exemplo);
        setLidas([]);
      }
    } catch (err) {
      console.error('Notificação – erro:', err.message);
      // fallback estático em caso de erro
      const exemploErro = [
        {
          idSessao: 'demo‑erro',
          IdPaciente: pacientes[0]?.id || 'demoPac',
          data: '2025-06-20',
          hora_inicio: '15:30',
          notificacaoPsicologo: false,
        },
      ];
      setNaoLidas(exemploErro);
      setLidas([]);
    }
  }, [notificacao_por_psicologo, usuarioAtual.id, pacientes]);

  useEffect(() => { carregar(); }, [carregar]);

  /* -------- seleção múltipla -------- */
  const toggle = (s) =>
    setSelecionadas((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  /* -------- marcar como lida -------- */
  const marcarComoLida = async () => {
    await Promise.all(
      selecionadas.map((s) =>
        typeof s.idSessao === 'string' && !s.idSessao.startsWith('demo')
          ? marcarNotificacaoComoLidaPsicologo(s.idSessao)
          : null
      )
    );
    setNaoLidas((prev) => prev.filter((s) => !selecionadas.includes(s)));
    setLidas((prev) => [...selecionadas, ...prev]);
    setSelecionadas([]);
  };

  /* -------- card -------- */
  const CardNotif = ({ s, podeSelecionar }) => (
    <TouchableOpacity disabled={!podeSelecionar} onPress={() => toggle(s)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {podeSelecionar && (
            <RadioButton
              value={s.idSessao}
              status={selecionadas.includes(s) ? 'checked' : 'unchecked'}
              onPress={() => toggle(s)}
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.descricao}>
              Sessão com {nomePaciente(s)}
            </Text>
            <Text style={styles.titulo}>
              {fmtDataHora(s.data, s.hora_inicio)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  /* -------- render -------- */
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Header corFundo="#F37187" href="psicologo/home" />

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* NÃO LIDAS */}
        <Text style={[styles.sectionHeader, styles.bold]}>NÃO LIDAS</Text>
        {naoLidas.length ? (
          <>
            <View style={styles.marcarComoLidaContainer}>
              <Text style={styles.marcarComoLidaBtn} onPress={marcarComoLida}>
                MARCAR COMO LIDA
              </Text>
            </View>

            {naoLidas.map((s) => (
              <CardNotif key={s.idSessao} s={s} podeSelecionar />
            ))}
          </>
        ) : (
          <Text style={styles.noNotificationsText}>
            Nenhuma notificação pendente 🙂
          </Text>
        )}

        {/* LIDAS */}
        <Text style={[styles.sectionHeader, styles.bold, { marginTop: 25 }]}>
          LIDAS
        </Text>
        {lidas.length ? (
          lidas.map((s) => <CardNotif key={s.idSessao} s={s} />)
        ) : (
          <Text style={styles.noNotificationsText}>
            Você ainda não leu notificações.
          </Text>
        )}
      </ScrollView>
    </ScrollView>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  scrollView: { padding: 20, backgroundColor: 'white' },
  sectionHeader: {
    fontSize: 18,
    color: '#F37187',
    textAlign: 'center',
    marginBottom: 10,
  },
  bold: { fontFamily: 'Poppins-Bold' },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FCE4EC',
    elevation: 2,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  textContainer: { flex: 1, marginLeft: 10 },
  titulo: { fontSize: 12, color: '#333', fontFamily: 'Poppins-Light' },
  descricao: { fontSize: 14, color: '#666', fontFamily: 'Poppins-Light' },
  marcarComoLidaContainer: { alignItems: 'flex-end', marginBottom: 10 },
  marcarComoLidaBtn: { fontSize: 14, color: '#F37187' },
  noNotificationsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins-Light',
  },
});

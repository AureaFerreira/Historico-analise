import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, RadioButton } from 'react-native-paper';

export default function NotificacaoPaciente() {
  const { notificacao_por_psicologo, usuarioAtual, marcarNotificacaoComoLidaPsicologo } = useAppContext();

  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState([]);
  const [notificacoesSelecionadas, setNotificacoesSelecionadas] = useState([]);

  useEffect(() => {
    const fetchSessoes = async () => {
      const data = await notificacao_por_psicologo(usuarioAtual.id);

      data.sort((sessao1, sessao2) => {
        const dataHoraSessao1 = new Date(`${sessao1.data} ${sessao1.hora_inicio}`);
        const dataHoraSessao2 = new Date(`${sessao2.data} ${sessao2.hora_inicio}`);
        return dataHoraSessao1 - dataHoraSessao2;
      });

      const dataHoraAtual = new Date();
      const sessoesFuturas = data.filter(sessao => {
        const dataHoraSessao = new Date(`${sessao.data} ${sessao.hora_inicio}`);
        return dataHoraSessao > dataHoraAtual;
      });

      setNotificacoesNaoLidas(sessoesFuturas);
    };

    fetchSessoes();
  }, [notificacao_por_psicologo, usuarioAtual]);

  const toggleSelecionada = (sessao) => {

    if (notificacoesSelecionadas.includes(sessao)) {

      const novasSelecionadas = notificacoesSelecionadas.filter(s => s !== sessao);
      setNotificacoesSelecionadas(novasSelecionadas);
    } else {

      setNotificacoesSelecionadas([...notificacoesSelecionadas, sessao]);
    }
  };

  const marcarComoLida = async () => {
    const novasNaoLidas = notificacoesNaoLidas.filter(n => !notificacoesSelecionadas.includes(n));
    setNotificacoesNaoLidas(novasNaoLidas);

    for (const sessao of notificacoesSelecionadas) {
      await marcarNotificacaoComoLidaPsicologo(sessao.idSessao);
    }

    setNotificacoesSelecionadas([]);
  };

  return (
    <ScrollView style={{backgroundColor:'white'}}>
      <Header corFundo="#F37187" href='psicologo/home' />
      <ScrollView contentContainerStyle={styles.scrollView}>

        <Text style={[styles.sectionHeader, styles.boldText]}>NÃO LIDAS</Text>
        {notificacoesNaoLidas.length > 0 ? (
          <>
            <View style={styles.marcarComoLidaContainer}>
              <Text style={styles.marcarComoLida} onPress={marcarComoLida}>MARCAR COMO LIDA</Text>
            </View>
            {notificacoesNaoLidas.map((sessao, index) => (
              <TouchableOpacity key={index} onPress={() => toggleSelecionada(sessao)}>
                <Card style={styles.cardNotLidas}>
                  <Card.Content>
                    <View style={styles.cardContent}>
                      <RadioButton
                        value={sessao}
                        status={notificacoesSelecionadas.includes(sessao) ? 'checked' : 'unchecked'}
                        onPress={() => toggleSelecionada(sessao)}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.descricao}>Nova sessão agendada</Text>
                        <Text style={styles.titulo}>Paciente: {sessao.Paciente.nome}</Text>
                        <Text style={styles.titulo}>Data: {sessao.data}</Text>
                        <Text style={styles.titulo}>Hora de Início: {sessao.hora_inicio}</Text>
                        <Text style={styles.titulo}>Quantidade de Sessões: {sessao.qtdSessoes}</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <Text style={styles.noNotificationsText}>Não existem notificações!</Text>
        )}

      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionHeader: {
    fontSize: 18,
    color: '#F37187',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  boldText: {
    fontFamily: 'Poppins-Bold',
  },
  cardNotLidas: {
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#FCE4EC',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  titulo: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins-Light',
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Light',
  },
  marcarComoLidaContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  marcarComoLida: {
    fontSize: 14,
    color: '#F37187',
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins-Light',
  },
});

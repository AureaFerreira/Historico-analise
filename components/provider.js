import { useState, createContext, useContext, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [filtroAtivoBarra, setFiltroAtivoBarra] = useState(false);
  const [filtroAtivoBusca, setFiltroAtivoBusca] = useState(false);
  const [filtroAtivo, setFiltro] = useState(false);
  const cores = ['pink', 'gray', 'purple'];
  const [psicologosBuscados, setPsicologosBuscados] = useState([]);
  const [psicologosFiltrados, setPsicologosFiltrados] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState();

  useEffect(() => {
    coletaDadosPsicologos();
    coletaDadosPacientes();
  }, []);

  const coletaDadosPsicologos = async () => {
    const { data } = await supabase
      .from('Psicologo')
      .select()
    setPsicologos(data)
  }

  const coletaDadosPacientes = async () => {
    const { data } = await supabase
      .from('Paciente')
      .select()
    setPacientes(data)
  }

  const buscaPsicologoId = async (id) => {
    const { data } = await supabase
      .from('Psicologo')
      .select()
      .eq('id', id)
    return data
  }

  const buscaPacienteId = async (id) => {
    const { data } = await supabase
      .from('Paciente')
      .select()
      .eq('id', id)
    return data
  }
  const buscaUsuarioId = async (id) => {
    try {
      const { data: psicologoData, error: psicologoError } = await supabase
        .from('Psicologo')
        .select('*')
        .eq('id', id);
      if (psicologoError) {
        throw psicologoError;
      }
      if (psicologoData.length > 0) {
        return { tipo: 'psicologo', data: psicologoData[0] };
      }

      const { data: pacienteData, error: pacienteError } = await supabase
        .from('Paciente')
        .select('*')
        .eq('id', id);

      if (pacienteError) {
        throw pacienteError;
      }

      if (pacienteData.length > 0) {
        return { tipo: 'paciente', data: pacienteData[0] };
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error.message);
      throw error;
    }
  }

  const filtroStatus = async (status) => {
    if (status === 'Todos') {
      const { data } = await supabase
        .from('Psicologo')
        .select()
      return data

    } else {
      const { data } = await supabase
        .from('Psicologo')
        .select()
        .eq('status', status)
      return data
    }
  }

  const filtroTag = async (tag) => {
    const { data } = await supabase
      .from('Psicologo')
      .select()
      .in('tags', tag)
    return data
  }

  const buscaLogin = async (email, senha) => {
    try {
      const { data, error } = await supabase
        .from('Usuario')
        .select()
        .eq('email', email)
        .eq('senha', senha);

      if (error) throw error;

      if (!data) {
        console.log('Nenhum usuário encontrado.');
        return undefined;
      }

      const usuario = data[0];
      setUsuarioAtual(usuario);

      const emailPsicologo = await buscaPsicologoEmail(email);
      const emailPaciente = await buscaPacienteEmail(email);

      if (emailPsicologo) {
        return "Psicologo";
      } else if (emailPaciente) {
        return "Paciente";
      } else {
        return undefined;
      }
    } catch (error) {
      console.log('Erro ao buscar login:', error.message);
      return undefined;
    }
  };

  const buscaPsicologoEmail = async (email) => {
    try {
      const { data, error } = await supabase
        .from('Psicologo')
        .select()
        .eq('email', email);

      if (error) throw error;

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.log('Erro ao buscar psicólogo:', error.message);
      return null;
    }
  };

  const buscaPacienteEmail = async (email) => {
    try {
      const { data, error } = await supabase
        .from('Paciente')
        .select()
        .eq('email', email);

      if (error) throw error;

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.log('Erro ao buscar paciente:', error.message);
      return null;
    }
  };


  const renderStars = (quantEstrelas) => {
    const stars = [];
    for (let i = 0; i < quantEstrelas; i++) {
      stars.push(<AntDesign name="star" size={15} color="gold" />);
    }
    if (stars.length < 5) {
      for (let i = stars.length; i < 5; i++) {
        stars.push(<AntDesign name="staro" size={15} color="gold" />);
      }
    }
    return stars;
  };

  const buscarPsicologo = (nome) => {
    if (nome == '') {
      setPsicologosBuscados([]);
      setFiltroAtivoBusca(false);
    }
    else {
      let listaDeNovasPessoas = psicologos.filter(psicologos => psicologos.nome.startsWith(nome));
      setPsicologosBuscados(listaDeNovasPessoas);
      setFiltroAtivoBusca(true);
    }
  };

  const AgendaPsicologo = async (psicologoId) => {
    try {
      const { data: sessoes, error } = await supabase
        .from('Sessao')
        .select(`
          *,
          Paciente (
            id,
            nome
          ),
          Psicologo (
            id,
            nome,
            duracao
          )
        `)
        .eq('idPsicologo', psicologoId)
        .order('data', { ascending: true }); // Adiciona a ordenação pela coluna 'data'

      if (error) throw error;

      return sessoes;
    } catch (error) {
      console.error('Erro ao buscar todas as sessões:', error.message);
      return [];
    }
  };




  const sessaoPorPsicologo = async (psicologoId) => {
    const { data, error } = await supabase
      .from('Sessao')
      .select('*')
      .eq('idPsicologo', psicologoId);

    if (error) {
      console.error('Erro ao buscar as sessoes do psicólogo', error);
      return [];
    }

    return data;
  };

  const horarioMaisProximoPorPsicologo = async (psicologoId) => {
    console.log('entrei');
    try {
      const currentDateTime = new Date().toISOString(); // Obtém a data e hora atuais no formato ISO

      const { data, error } = await supabase
        .from('Agenda')
        .select('data, hora_inicio')
        .eq('idPsicologo', psicologoId)
        .eq('disponivel', true)
        .gte('data', currentDateTime.slice(0, 16))
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (error) {
        console.error('Erro ao buscar dados:', error);
        return null;
      }

      if (data.length === 0) {
        return null;
      }

      return data[0];
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return null;
    }
  };




  const datasDisponiveisPorPsicologo = async (psicologoId) => {
    // Obter a data atual no formato adequado
    const today = new Date().toISOString().split('T')[0]; // formato 'yyyy-mm-dd'
  
    const { data, error } = await supabase
      .from('Agenda')
      .select('id, idPsicologo, data, hora_inicio, disponivel')
      .eq('idPsicologo', psicologoId)
      .eq('disponivel', true)
      .gte('data', today); // Filtrar apenas datas maiores ou iguais a hoje
  
    if (error) {
      console.error('Erro ao buscar dados:', error);
      return [];
    }
    return data;
  };
  const consultarHorariosDisponiveis = async (psicologoId, date) => {
    const { data, error } = await supabase
      .from('Agenda')
      .select('id, data, hora_inicio')
      .eq('idPsicologo', psicologoId)
      .eq('data', date)
      .eq('disponivel',true)

    if (error) {
      console.error('Erro ao buscar dados:', error);
      return [];
    }

    return data;
  };

  const listarPaciente = async () => {
    const { data } = await supabase
      .from('Paciente')
      .select()
    return data
  }

  const listarPsicologo = async () => {
    const { data } = await supabase
      .from('Psicologo')
      .select()
    return data
  }

  const ListarPacientesPorPsicologo = ({ idPsicologo }) => {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
      async function buscarPacientes() {
        try {
          const { data, error } = await supabase
            .from('Sessao')
            .select('IdPaciente')
            .eq('idPsi', idPsicologo);
          if (error) {
            throw error;
          }
          const idsPacientes = data.map(sessao => sessao.IdPaciente);
          const { data: dataPacientes, error: errorPacientes } = await supabase
            .from('Pacientes')
            .select('*')
            .in('idPaciente', idsPacientes);
          if (errorPacientes) {
            throw errorPacientes;
          }
          setPacientes(dataPacientes);
        } catch (error) {
          console.error('Erro ao buscar pacientes:', error.message);
        }
      }
      buscarPacientes();
    }, [idPsicologo]);
  }

  const inserirNota = async (idSessao, idPaciente, idPsicologo, verificacaoDeHumor, metasTerapeuticas, anotacoesRelevantes, atividadesDaSemana, feedback, abordarProximaSessao) => {
    const sessaoDados = {
      idSessao,
      idPaciente,
      idPsicologo,
      verificacaoDeHumor,
      metasTerapeuticas,
      anotacoesRelevantes,
      atividadesDaSemana,
      feedback,
      abordarProximaSessao
    };

    const { data: insertedData } = await supabase
      .from('Nota')
      .insert([sessaoDados])

    vincularNota(idSessao)
  }

  const vincularNota = async (idSessao) => {
    const { data, error } = await supabase
      .from('Nota')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
    console.log(data)

    const { data: fetchData } = await supabase
      .from('Sessao')
      .select('notasDeSessao')
      .eq('idSessao', idSessao)

    let [{ notasDeSessao }] = fetchData;

    const listaAtual = notasDeSessao || [];
    let [{ id }] = data;

    const listaAtualizada = [...listaAtual, id]

    const { data: updateData } = await supabase
      .from('Sessao')
      .update({ notasDeSessao: listaAtualizada })
      .eq('idSessao', idSessao)
  }

  const listarNotas = async (idPaciente) => {
    const { data } = await supabase
      .from('Nota')
      .select()
      .eq('idPaciente', idPaciente)
    return data
  }


  const inserirSessao = async (id_agenda, idPaciente, qtdSessoes, valor, intervalo) => {
    const { data, error } = await supabase
      .from('Sessao')
      .insert([
        {
          IdPaciente: idPaciente,
          id_agenda: id_agenda,
          qtdSessoes: qtdSessoes,
          valor: valor,
          notasDeSessao: null,
          qtdSessoesFeitas: null,
          intervalo: intervalo
        }
      ])
      .select();
    if (error) {
      console.error('Erro ao inserir sessão:', error);
    } else {
      console.log('Sessão inserida com sucesso:', data);
    }
  };


  const meus_pacientes = async (idPsicologo) => {
    const [pacientes, setPacientes] = useState([]);
    try {
      const { data: sessoes, error: sessoesError } = await supabase
        .from('Sessao')
        .select('IdPaciente')
        .eq('idPsi', idPsicologo);

      if (sessoesError) throw sessoesError;

      const idsPacientes = sessoes.map(sessao => sessao.IdPaciente);
      const { data: pacientes, error: pacientesError } = await supabase
        .from('Paciente')
        .select('*')
        .in('id', idsPacientes);

      if (pacientesError) throw pacientesError;

      return pacientes;
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error.message);
      return [];
    }
  };

  const sessoes_por_paciente = async (idPaciente) => {
    try {
      const { data: sessoes, error } = await supabase
        .from('Sessao')
        .select(`
          *,
          Psicologo (
            id,
            nome,
            especialidade,
            imageUrl,
            quantEstrelas,
            tags,
            status,
            crp,
            abordagem,
            telefone,
            email,
            duracao,
            valorSessao,
            pix,
            detalhes
          )
        `)
        .eq('IdPaciente', idPaciente);
      if (error) throw error;
      return sessoes;
    } catch (error) {
      console.error('Erro ao buscar sessões:', error.message);
      return [];
    }
  };

  const sessoes_completas = async (idSessao) => {
    try {
      const { data: sessoes, error } = await supabase
        .from('Sessao')
        .select(`
          *,
          Paciente (
            id,
            nome
          ),
          Psicologo(
          id,
          nome
          )
        `)
        .eq('idSessao', idSessao);

      if (error) throw error;

      return sessoes;
    } catch (error) {
      console.error('Erro ao buscar todas as sessões:', error.message);
      return [];
    }
  }

  const sessao_mais_proxima = async (idPsicologo) => {
    try {
      const now = new Date();

      const { data: sessoes, error } = await supabase
        .from('Sessao')
        .select(`
          *,
          Paciente (
            id,
            nome
          )
        `)
        .eq('idPsicologo', idPsicologo)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (error) throw error;

      if (sessoes.length === 0) {
        return null;
      }

      const sessoesFuturas = sessoes.filter(sessao => {
        const sessaoDateTime = new Date(`${sessao.data}T${sessao.hora_inicio}`);
        return sessaoDateTime > now;
      });

      if (sessoesFuturas.length === 0) {
        return null;
      }


      return sessoesFuturas[0];
    } catch (error) {
      console.error('Erro ao buscar a sessão mais próxima:', error.message);
      return null;
    }
  };
  const sessao_mais_proxima_paciente = async (idPaciente) => {
    try {
      const now = new Date();

      const { data: sessoes, error } = await supabase
        .from('Sessao')
        .select(`
                *,
                Paciente (
                    id,
                    nome
                ),
                Psicologo (
                    id,
                    nome
                )
            `)
        .eq('IdPaciente', idPaciente)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (error) throw error;

      if (sessoes.length === 0) {
        return null;
      }

      const sessoesFuturas = sessoes.filter(sessao => {
        const sessaoDateTime = new Date(`${sessao.data}T${sessao.hora_inicio}`);
        return sessaoDateTime > now;
      });

      if (sessoesFuturas.length === 0) {
        return null;
      }

      // Retornando a primeira sessão futura encontrada
      const sessaoMaisProxima = sessoesFuturas[0];

      // Adicionando os dados do psicólogo à sessão mais próxima
      sessaoMaisProxima.Psicologo = {
        id: sessaoMaisProxima.IdPsicologo,
        nome: sessaoMaisProxima.Psicologo.nome  // Nome do psicólogo já está presente na consulta
      };

      return sessaoMaisProxima;
    } catch (error) {
      console.error('Erro ao buscar a sessão mais próxima:', error.message);
      return null;
    }
  };


  const agendaDisponivelPorPsicologo = async (idPsicologo) => {
    const { data } = await supabase
      .from('Agenda')
      .select('id, idPsicologo, data, hora_inicio, hora_fim, disponivel')
      .eq('idPsicologo', idPsicologo)
      .eq('disponivel', true);
    return data;
  }

  const buscaNotaId = async (id) => {
    const { data } = await supabase
      .from('Nota')
      .select()
      .eq('id', id)
    return data
  };

  const statusAgenda = async (idPsi) => {
    const { data } = await supabase
      .from('Agenda')
      .select()
      .eq('idPsicologo', idPsi)
    return data
  }
  const uploadComprovante = async (file, filename) => {
    const { data, error } = await supabase.storage
      .from('comprovante')
      .upload(`comprovantes/${filename}`, file);

    return { data, error };
  };



  const marcarNotificacaoComoLidaPaciente = async (idSessao) => {
    try {
      const { data, error } = await supabase
        .from('Sessao')
        .update({ notificacaoPaciente: true })
        .eq('idSessao', idSessao);
      if (error) {
        throw error;
      }
      console.log('Notificação marcada como lida:', data);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error.message);
    }
  };

  const notificacao_por_paciente = async (idPaciente) => {
    try {
      const { data: sessoes, error } = await supabase
        .from('Sessao')
        .select()
        .eq('IdPaciente', idPaciente)
        .eq('notificacaoPaciente', false);
      if (error) throw error;
      return sessoes;
    } catch (error) {
      console.error('Erro ao buscar sessões:', error.message);
      return [];
    }
  };

  const marcarNotificacaoComoLidaPsicologo = async (idSessao) => {
    try {
      const { data, error } = await supabase
        .from('Sessao')
        .update({ notificacaoPsicologo: true })
        .eq('idSessao', idSessao);
      console.log(data)
      if (error) {
        throw error;
      }
      console.log('Notificação marcada como lida:', data);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error.message);
    }
  };

  const notificacao_por_psicologo = async (idPsicologo) => {
    try {
      const { data: sessoes, error } = await supabase
        .from('Sessao')
        .select(`
                idSessao,
                data,
                hora_inicio,
                qtdSessoes,
                Paciente:Paciente(
                nome
                )
              `)
        .eq('idPsicologo', idPsicologo)
        .eq('notificacaoPsicologo', false);

      if (error) throw error;
      return sessoes;
    } catch (error) {
      console.error('Erro ao buscar sessões:', error.message);
      return [];
    }
  };

  const marcarSessaoConcluida = async (idSessao) => {
    try {
      const { data, error } = await supabase
        .from('Sessao')
        .update({ ativa: false })
        .eq('idSessao', idSessao);
      if (error) {
        throw error;
      }
      console.log('Sessão marcada como concluída:', data);
    } catch (error) {
      console.error('Erro ao marcar sessão como concluída:', error.message);
    }
  };

  const buscaPaacienteMeet = async (idPaci, idPsi) => {
    const { data, error } = await supabase
      .from('Meet')
      .select()
      .eq('idPaci', idPaci)
      .eq('idPsi', idPsi)
      .single()
    console.log(data)
    return data.codigoMeet
  }

  const inserirMeet = async (idPsicologo, idPaciente, codigoMeet) => {
    const { error } = await supabase
      .from('Meet')
      .insert({ idPsi: idPsicologo, idPaci: idPaciente, codigoMeet: codigoMeet })
  }
  const contratoAssinado = async (idSessao) => {
    try {
      const { data, error } = await supabase
        .from('Sessao')
        .update({ contrato: true })
        .eq('idSessao', idSessao);
      if (error) {
        throw error;
      }
      console.log('Contarto assinado', data);
    } catch (error) {
      console.error('Erro ao assinar contrato', error.message);
    }
  };
  const [timesSessao, setTimes] = useState(null);
  const setTimesData = (newTimes) => {
    setTimes(newTimes);
  };

  return (
    <AppContext.Provider value={{
      psicologos,
      renderStars,
      cores,
      datasDisponiveisPorPsicologo,
      buscarPsicologo,
      psicologosBuscados,
      filtroAtivoBarra,
      filtroAtivoBusca,
      setFiltroAtivoBarra,
      setFiltroAtivoBusca,
      pacientes,
      buscaPsicologoId,
      buscaPacienteId,
      filtroStatus,
      filtroTag,
      filtroAtivo,
      setFiltro,
      setPsicologosFiltrados,
      psicologosFiltrados,
      AgendaPsicologo,
      listarPaciente,
      listarPsicologo,
      ListarPacientesPorPsicologo,
      listarNotas,
      inserirNota,
      vincularNota,
      buscaLogin,
      usuarioAtual,
      meus_pacientes,
      sessoes_por_paciente,
      sessoes_completas,
      sessaoPorPsicologo,
      agendaDisponivelPorPsicologo,
      consultarHorariosDisponiveis,
      buscaNotaId,
      inserirSessao,
      buscaUsuarioId,
      uploadComprovante,
      statusAgenda,
      marcarNotificacaoComoLidaPaciente,
      notificacao_por_paciente,
      sessao_mais_proxima,
      sessao_mais_proxima_paciente,
      marcarNotificacaoComoLidaPsicologo,
      notificacao_por_psicologo,
      marcarSessaoConcluida,
      horarioMaisProximoPorPsicologo,
      buscaPaacienteMeet,
      inserirMeet,
      contratoAssinado,
      timesSessao, 
      setTimesData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
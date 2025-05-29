import { React, useEffect, useState } from 'react';
import CardHome from '@/components/paciente/cardHome';
import Busca from '@/components/buscar/busca';
import Filtro from '@/components/buscar/filtro';
import BarraTopo from '@/components/buscar/barraTopo';
import Header from '@/components/geral/header';
import { useAppContext } from '@/components/provider';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import ProgressBar from './[id]/barraProgresso';

export default function ListaPsicologos() {
    const { psicologos, filtroAtivoBarra, filtroAtivoBusca, psicologosBuscados, filtroAtivo, psicologosFiltrados, statusAgenda } = useAppContext();
    const [listaStatus, setListaStatus] = useState([]); 
    const [currentPage, setCurrentPage] = useState(0);
    const [status, setStatus] = useState([]);

    useEffect(() => {

        const status = async () => {
            const newStatusList = [];
            for (var psicologo of psicologos) {
                const respostas = await statusAgenda(psicologo.id);
                var contador = 0
                for (var resposta of respostas) {
                    if (resposta.disponivel == true) {
                        newStatusList.push('Disponível');
                        break
                    }
                    contador++
                }
                if (contador == respostas.length) {
                    newStatusList.push('Indisponível');
                }
            }
            setStatus(newStatusList);
        };
        status();
    }, []);

    return (
        <ScrollView>

            <Header corFundo="#477BDE" href='paciente/home'></Header>
            <View style={styles.container} >

                <BarraTopo />
                {filtroAtivoBarra && <Busca />}
                {filtroAtivo && <Filtro />}
                {!filtroAtivoBusca && !filtroAtivo &&
                    psicologos.map((psicologo, index) => (
                        <Link key={psicologo.id}
                            href={`paciente/psicologos/${psicologo.id}`} >
                            <CardHome psicologo={psicologo} status={status} key={psicologo.id} index={index}/>
                        </Link>
                    ))
                }
                {filtroAtivoBusca &&
                    psicologosBuscados.map((psicologo, index) => (
                        <Link key={psicologo.id}
                            href={`paciente/psicologos/${psicologo.id}`} >
                            <CardHome psicologo={psicologo} status={status} key={psicologo.id} index={index}/>
                        </Link>
                    ))
                }
                {filtroAtivo &&
                    psicologosFiltrados.map((psicologo, index) => (
                        <Link key={psicologo.id}
                            href={`paciente/psicologos/${psicologo.id}`} >
                            <CardHome psicologo={psicologo} status={status} key={psicologo.id} index={index} />

                        </Link>
                    ))
                }
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
});

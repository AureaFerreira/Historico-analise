import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useAppContext } from '../provider';
import { Appbar } from 'react-native-paper';

export default function BarraTopo() {
    const { setFiltroAtivoBarra, setFiltro, filtroAtivo, setPsicologosFiltrados} = useAppContext();

    const visualizaFiltro = () => {
        setFiltro(filtroAtivo => !filtroAtivo);
        if (filtroAtivo === false) {
            setPsicologosFiltrados([]);
        };
        setFiltroAtivoBarra(false);
    };

    const visualizaBusca = () => {
        setFiltroAtivoBarra(filtroAtivo => !filtroAtivo);
        setFiltro(false);
    };

    return (
        <Appbar.Header style={{backgroundColor: '#0000'}}>
            <Appbar.Content title="Psicólogos" titleStyle={{fontFamily:'Poppins-Medium', fontSize:18}}/>
            <Appbar.Action icon={() => <AntDesign name="filter" size={20} color="black" />} onPress={visualizaFiltro} />
            <Appbar.Action icon={() => <AntDesign name="search1" size={20} color="black" />} onPress={visualizaBusca} />
        </Appbar.Header>
    );
}
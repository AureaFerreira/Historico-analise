import { React, useState } from 'react';
import { StyleSheet, View} from 'react-native';
import { useAppContext } from '../provider';
import { SelectList } from 'react-native-dropdown-select-list'

export default function Filtro() {
    const { filtroStatus, setPsicologosFiltrados } = useAppContext();

    const buscaDados = async (valor) => {
        const dados = await filtroStatus(valor);
        setPsicologosFiltrados(dados);
    };

    const dataStatus = [
        { key: '1', value: 'Todos' },
        { key: '2', value: 'Disponível' },
        { key: '3', value: 'Indisponível' },
    ]

    return (
        <>
            <View style={styles.barraFiltro}>
                <SelectList
                    setSelected={(valor) => buscaDados(valor)}
                    data={dataStatus}
                    save="value"
                    placeholder="Status"
                    searchPlaceholder="Digite o status"
                />
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    barraFiltro: {
        marginBottom: 20,
    },
});
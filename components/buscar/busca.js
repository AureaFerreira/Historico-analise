import { React, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { AntDesign, Feather } from '@expo/vector-icons';
import {useAppContext} from '../provider';

export default function Busca() {
    const { buscarPsicologo } = useAppContext();
    const [entrada, setEntrada] = useState('');

    return (
        <Searchbar style={styles.barrabusca}
            placeholder="Search"
            onChangeText={setEntrada}
            value={entrada}
            icon={() => <AntDesign name="search1" size={20} color="black" />}
            clearIcon={() => <Feather name="delete" size={20} color="black" />}
            onIconPress={() => buscarPsicologo(entrada)}
        />
    );
};

const styles = StyleSheet.create({
    barrabusca: {
        flex: 1,
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        color: 'black'
    },
});
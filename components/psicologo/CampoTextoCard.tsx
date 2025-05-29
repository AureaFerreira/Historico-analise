import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function CampoTexto({ titulo, valor, setValor }) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cabecalhoCard}>
        <Text style={styles.tituloCard}>{titulo.toUpperCase()}</Text>
      </View>
      <View style={styles.conteudoCard}>
        <TextInput
          placeholder="Digite aqui"
          placeholderTextColor="#B0B0B0"
          value={valor}
          onChangeText={setValor}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={[
            styles.input,
            { borderColor: focado ? '#F37187' : '#CCC' },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  cabecalhoCard: {
    backgroundColor: '#F37187',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  tituloCard: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    paddingVertical: 5,
  },
  conteudoCard: {
    backgroundColor: '#FFF',
    padding: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  input: {
    fontFamily: 'Poppins-Light',
    fontSize: 15,
    color: '#606060',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
});

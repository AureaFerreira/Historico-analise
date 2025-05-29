import { Link } from 'expo-router';
import React from 'react';
import { Alert, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';

const AgendaItem = ({ item }) => {

  const formatoDuracao = (duracao) => {
    if (!duracao) {
      return (
        <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#477BDE" />
            </View>
      );
    }
    const [hours, minutes] = duracao.split(':').map(Number);
    if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const getInitials = (name) => {
    const nameArray = name.split(' ');
    const initials = nameArray.map(word => word[0]).join('');
    return initials.toUpperCase();
  };

  const getRandomColor = (name) => {
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = `#${((hash & 0xffffff) << 5).toString(16).padStart(6, '0')}`;
    return color;
  };


  return (
    <View style={styles.item}>
      
        <Link href={`psicologo/${item.entry.idSessao}`} key={item.entry.idSessao} >
          <View style={{ display: 'flex', }}>
            <View style={{ flex: 5, flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', margin: 3, marginRight: 6 }}>
                <Text style={styles.itemText}>{item.entry.hora_inicio.substring(0,5)}</Text>
                <Text style={styles.itemText2}>{formatoDuracao(item.entry.Psicologo.duracao)}</Text>
              </View>
              <View style={{ alignItems: 'center', margin: 3 }}>
                <Text style={[styles.sessaoText, { color: 'black' }]}>
                  Paciente: <Text style={{ fontFamily: 'Poppins-Medium' }}> {item.entry.Paciente.nome}</Text>
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                <Avatar.Text size={24}
                  label={getInitials(item.entry.Paciente.nome)}
                  labelStyle={{ fontFamily: 'Poppins-Light', fontWeight: 'bold' }}
                  style={{ backgroundColor: getRandomColor(item.entry.Paciente.nome) }}
                />
              </View>
            </View>
          </View>
        </Link>
     
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  itemText: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemText2: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
  },
  sessaoText: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

},
});

export default AgendaItem;

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, ToastAndroid, Alert, Platform } from 'react-native';
import { AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import AgendaItem from '@/components/psicologo/agendaItem';
import { useAppContext } from '@/components/provider';
import Header from '@/components/geral/header';
import { AntDesign } from '@expo/vector-icons';
import { Button } from "react-native-paper";

const Agenda = () => {
  const { usuarioAtual, AgendaPsicologo } = useAppContext();
  const [markedDates, setMarkedDates] = useState({});
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: new Date(),
    time: new Date(),
    type: '',
    name: ''
  });

  useEffect(() => {
    if (usuarioAtual) {
      loadItems();
    }
  }, [usuarioAtual]);

  const loadItems = async () => {
    if (!usuarioAtual) return;

    const psicologoId = usuarioAtual.id;
    const agendaData = await AgendaPsicologo(psicologoId);

    const items = {};
    agendaData.forEach((entry) => {
      const strTime = entry.data;
      if (!items[strTime]) {
        items[strTime] = [];
      }
      items[strTime].push({ entry });
    });

    setItems(items);
  };

  const handleSaveAppointment = () => {
    setModalVisible(false);

    if (Platform.OS === 'android') {
      ToastAndroid.show("Compromisso adicionado com sucesso!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Sucesso", "Compromisso adicionado com sucesso!");
    }
  };

  return (
    <CalendarProvider date={selectedDate} showTodayButton>
      <Header corFundo={'#F37187'} href='psicologo/home' />
      <WeekCalendar
        markedDates={markedDates}
        firstDay={1}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      <AgendaList
        sections={Object.keys(items).map(key => ({ title: key, data: items[key] }))}
        renderItem={({ item }) => <AgendaItem item={item} />}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.floatingButton}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Compromisso</Text>
            <TextInput
              style={styles.input}
              placeholder="Tipo de Compromisso"
              placeholderTextColor={'#e63946'}
              value={newAppointment.type}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, type: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome do Compromisso"
              placeholderTextColor={'#e63946'}
              value={newAppointment.name}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, name: text }))}
            />
            <View style={{ marginBottom: 10, flexDirection: 'row', gap: 10 }}>
              <View style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.label}>Data:</Text>
                <Text style={styles.date}>12:00</Text>
              </View>
              <View style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Text style={styles.label}>Horário:</Text>
                <Text style={styles.date}>13/02/2025</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 20, margin: 5 }}>
              <Button contentStyle={[styles.botao, { backgroundColor: '#F37187' }]} labelStyle={{ fontFamily: 'Poppins-Regular', color: 'white' }} onPress={() => setModalVisible(false)}>Cancelar</Button>
              <Button contentStyle={[styles.botao, { backgroundColor: '#8dcc28' }]} labelStyle={{ fontFamily: 'Poppins-Regular', color: 'white' }} onPress={handleSaveAppointment}>Salvar</Button>
            
            </View>
          </View>
        </View>
      </Modal>
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Poppins-Light'
  },
  input: {
    borderWidth: 1,
    borderColor: '#F37187',
    padding: 10,
    width: '100%',
    marginVertical: 10,
    borderRadius: 15,
    fontFamily: 'Poppins-Light',
    color: 'grey',
    backgroundColor: '#FFF9F9'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F37187',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  },
  botao: {
    borderRadius: 5
  },
  date: {
    backgroundColor: "#E8E8E8",
    padding: 5,
    borderRadius: 5,
    fontFamily: 'Poppins-Light',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'Poppins-Light',
  },
});

export default Agenda;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ProgressBar = ({ currentPage }) => {
  const steps = [
    { title: 'Escolher Psicologo', completed: currentPage >= 0 },
    { title: 'Horários', completed: currentPage >= 2 },
    { title: 'Contrato', completed: currentPage >= 3 },
    { title: 'Finalizar', completed: currentPage >= 4 },
  ];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View style={styles.stepContainer}>
            <View style={[styles.circle, step.completed && styles.completedCircle]}>
              {step.completed && <FontAwesome name="check" size={12} color="#fff" />}
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
          </View>
          {index < steps.length - 1 && (
            <View style={[styles.line, steps[index + 1].completed && styles.completedLine]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, // Espaçamento lateral
    paddingVertical: 10, // Espaçamento vertical
  },
  stepContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1, // Cada passo ocupa espaço igual
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  completedCircle: {
    backgroundColor: '#7fc517', // Cor verde quando a etapa está concluída
  },
  stepTitle: {
    fontSize: 10, // Tamanho da fonte
    textAlign: 'center',
    fontFamily:'Poppins-Light'
  },
  line: {
    height: 2,
    backgroundColor: '#ccc',
    flex: 1, // Linha flexível
  },
  completedLine: {
    backgroundColor: '#7fc517', // Cor verde quando a etapa está concluída
  },
});

export default ProgressBar;
